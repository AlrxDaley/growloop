import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Droplets, Sun, Search, Plus, User } from "lucide-react";
import { useZones } from "@/hooks/useZones";
import { useClients } from "@/hooks/useClients";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { usePlantMaterial } from "@/hooks/usePlantMaterial";
import { PlantMaterialMultiSelect } from "@/components/PlantMaterialMultiSelect";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Zones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { zones, isLoading, createZone, updateZone } = useZones();
  const { clients } = useClients();
  const { user } = useAuth();
  const { plantmaterial, isLoading: pmLoading } = usePlantMaterial();

  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [sectionCount, setSectionCount] = useState<number>(1);
  const suggestedNames = ["Left Flower Bed", "Right Flower Bed", "Rear Flower Bed", "Front Flower Bed", "Potted Plants"];
  const [sectionNames, setSectionNames] = useState<Array<{ suggestion: string; custom: string }>>(
    [{ suggestion: suggestedNames[0], custom: "" }]
  );
  const [sectionPlants, setSectionPlants] = useState<number[][]>([[]]);
  const [viewZone, setViewZone] = useState<any | null>(null);
  const [editZone, setEditZone] = useState<any | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editPlants, setEditPlants] = useState<number[]>([]);

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionCountChange = (count: number) => {
    const safe = Math.max(1, Math.min(10, count));
    setSectionCount(safe);
    setSectionNames(prev => {
      const next = Array.from({ length: safe }, (_, i) => ({
        suggestion: suggestedNames[i] ?? "",
        custom: prev[i]?.custom ?? ""
      }));
      return next;
    });
    setSectionPlants(prev => {
      const next = Array.from({ length: safe }, (_, i) => prev[i] ?? []);
      return next;
    });
  };

  const handleCreateZones = async () => {
    if (!selectedClientId) {
      toast({ title: "Select a client", description: "Please choose a client to link these zones.", variant: "destructive" });
      return;
    }
    const names = sectionNames
      .map(s => (s.custom?.trim() ? s.custom.trim() : s.suggestion?.trim()))
      .filter((n): n is string => !!n && n.length > 0);

    if (names.length === 0) {
      toast({ title: "Add at least one name", description: "Please select or enter names for the sections.", variant: "destructive" });
      return;
    }

    try {
      await Promise.all(
        names.map(async (name, idx) => {
          // @ts-ignore mutateAsync exists on the mutation object
          const created = await (createZone as any).mutateAsync({ client_id: selectedClientId, name, plant_count: 0 });
          const zoneId = created?.id as string;
          const selectedIds = sectionPlants[idx] || [];
          if (zoneId && selectedIds.length > 0 && user) {
            const rows = selectedIds.map(pid => ({
              user_id: user.id,
              zone_id: zoneId,
              plantmaterial_id: pid,
            }));
            const { error } = await supabase.from('zone_plantmaterial').insert(rows);
            if (error) throw error;
            await (updateZone as any).mutateAsync({ id: zoneId, plant_count: selectedIds.length });
          }
        })
      );
      setOpen(false);
      // reset form
      setSelectedClientId("");
      handleSectionCountChange(1);
      setSectionNames([{ suggestion: suggestedNames[0], custom: "" }]);
      setSectionPlants([[]]);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to create zones.", variant: "destructive" });
    }
  };
  const handleSaveEdit = async () => {
    if (!editZone) return;
    try {
      // Replace plant links
      await supabase.from('zone_plantmaterial').delete().eq('zone_id', editZone.id);
      if (user && editPlants.length > 0) {
        const rows = editPlants.map(pid => ({ user_id: user.id, zone_id: editZone.id, plantmaterial_id: pid }));
        const { error } = await supabase.from('zone_plantmaterial').insert(rows);
        if (error) throw error;
      }
      // Update zone attributes and trigger refetch via mutation
      await (updateZone as any).mutateAsync({ id: editZone.id, name: editName || editZone.name, plant_count: editPlants.length });
      toast({ title: 'Updated', description: 'Zone updated successfully' });
      setEditZone(null);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update zone', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading zones...</p>
        </div>
      </div>
    );
  }

  const getSunlightIcon = (sunlight: string) => {
    return <Sun className="w-4 h-4 text-yellow-500" />;
  };

  const groupedByClient = filteredZones.reduce((acc, z) => {
    const key = z.client_id || 'unknown';
    const clientName = z.client?.name || 'Unknown Client';
    if (!acc[key]) acc[key] = { clientName, zones: [] as typeof filteredZones };
    acc[key].zones.push(z);
    return acc;
  }, {} as Record<string, { clientName: string; zones: typeof filteredZones }>);
  const grouped = groupedByClient as Record<string, { clientName: string; zones: typeof filteredZones }>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Garden Zones</h2>
          <p className="text-muted-foreground">Track and manage garden zones across all clients</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add zone(s)</DialogTitle>
              <DialogDescription>Link zones to a client and name each garden section.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger id="client" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {clients?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sections">Number of sections</Label>
                <Select value={String(sectionCount)} onValueChange={(v) => handleSectionCountChange(parseInt(v))}>
                  <SelectTrigger id="sections" className="w-full">
                    <SelectValue placeholder="Select number of sections" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="space-y-4">
                  {Array.from({ length: sectionCount }, (_, i) => (
                    <div key={i} className="grid grid-cols-1 gap-2">
                      <div>
                        <Label className="text-sm">Section {i + 1} (suggested)</Label>
                        <Select
                          value={sectionNames[i]?.suggestion || undefined}
                          onValueChange={(v) =>
                            setSectionNames(prev => {
                              const next = [...prev];
                              next[i] = { suggestion: v === 'none' ? '' : v, custom: prev[i]?.custom ?? '' };
                              return next;
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a suggested name" />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-popover">
                            {suggestedNames.map((name) => (
                              <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Or custom name</Label>
                        <Input
                          className="w-full"
                          placeholder="Enter a personalized name"
                          value={sectionNames[i]?.custom ?? ""}
                          onChange={(e) =>
                            setSectionNames(prev => {
                              const next = [...prev];
                              next[i] = { suggestion: next[i]?.suggestion ?? "", custom: e.target.value };
                              return next;
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Plants in this section</Label>
                        <PlantMaterialMultiSelect
                          options={plantmaterial.map(pm => ({ id: pm.id, label: pm.common_name || pm.scientific_name || `#${pm.id}` }))}
                          isLoading={pmLoading}
                          value={sectionPlants[i] ?? []}
                          onChange={(val) => setSectionPlants(prev => {
                            const next = [...prev];
                            next[i] = val;
                            return next;
                          })}
                          placeholder="Type to search and select plants"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateZones}
                disabled={!selectedClientId}
              >
                Create {sectionCount > 1 ? `${sectionCount} Zones` : "Zone"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search zones or clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client Gardens */}
      <div className="space-y-4">
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.entries(grouped).map(([clientId, group]) => (
            <AccordionItem key={clientId} value={clientId}>
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex justify-between w-full items-center">
                    <div className="text-left">
                      <p className="text-lg font-semibold">{group.clientName} — Garden</p>
                      <p className="text-sm text-muted-foreground">Click to view sections</p>
                    </div>
                    <Badge variant="secondary">{group.zones.length} sections</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {group.zones.map((zone) => (
                        <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span>{zone.name}</span>
                                </CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {group.clientName}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Size</p>
                                  <p className="font-semibold">{zone.size}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Plants</p>
                                  <p className="font-semibold">{zone.plant_count}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center">
                                    {getSunlightIcon(zone.sunlight)}
                                    <span className="ml-2 text-muted-foreground">{zone.sunlight || 'Unknown'}</span>
                                  </div>
                                  <span className="text-muted-foreground">{zone.soil_type || 'Unknown'} soil</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                                  <span className="text-muted-foreground">Water: {zone.watering_schedule || 'No schedule'}</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Current Plants:</p>
                                <div className="flex flex-wrap gap-1">
                                  {zone.plants?.slice(0, 3).map((plant, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {plant.name}
                                    </Badge>
                                  ))}
                                  {zone.plants && zone.plants.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{zone.plants.length - 3} more
                                    </Badge>
                                  )}
                                  {(!zone.plants || zone.plants.length === 0) && (
                                    <span className="text-xs text-muted-foreground">No plants recorded</span>
                                  )}
                                </div>
                              </div>

                              {zone.notes && (
                                <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                                  {zone.notes}
                                </p>
                              )}

                              <p className="text-xs text-muted-foreground">
                                Created: {new Date(zone.created_at).toLocaleDateString()}
                              </p>

                              <div className="flex space-x-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewZone(zone)}>
                                  View Details
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditZone(zone);
                                    setEditName(zone.name);
                                    const ids = (zone as any)?.zone_plantmaterial?.map((zp: any) => zp?.plantmaterial?.id).filter((id: any) => typeof id === 'number') || [];
                                    setEditPlants(ids);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={!!viewZone} onOpenChange={(o) => { if (!o) setViewZone(null); }}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Zone details</DialogTitle>
            <DialogDescription>Details for {viewZone?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-semibold">{viewZone?.client?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-semibold">{viewZone?.size || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sunlight</p>
                <p className="font-semibold">{viewZone?.sunlight || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Soil</p>
                <p className="font-semibold">{viewZone?.soil_type || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Plants</p>
              {!viewZone?.zone_plantmaterial?.length && (
                <p className="text-sm text-muted-foreground">No plants recorded</p>
              )}
              <div className="space-y-3">
                {viewZone?.zone_plantmaterial?.map((zp: any, idx: number) => {
                  const pm = zp?.plantmaterial || {};
                  return (
                    <div key={idx} className="rounded-md border p-3">
                      <p className="font-medium">
                        {pm.common_name || pm.scientific_name || `#${pm.id}`}
                        {pm.scientific_name && pm.common_name && (
                          <span className="text-muted-foreground"> — <i>{pm.scientific_name}</i></span>
                        )}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                        {pm.category && (<div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{pm.category}</span></div>)}
                        {pm.soil && (<div><span className="text-muted-foreground">Soil:</span> <span className="font-medium">{pm.soil}</span></div>)}
                        {pm.watering && (<div><span className="text-muted-foreground">Watering:</span> <span className="font-medium">{pm.watering}</span></div>)}
                        {pm.fertiliser && (<div><span className="text-muted-foreground">Fertiliser:</span> <span className="font-medium">{pm.fertiliser}</span></div>)}
                        {pm.pruning && (<div><span className="text-muted-foreground">Pruning:</span> <span className="font-medium">{pm.pruning}</span></div>)}
                        {pm.propagation && (<div><span className="text-muted-foreground">Propagation:</span> <span className="font-medium">{pm.propagation}</span></div>)}
                        {pm.flowering_period && (<div><span className="text-muted-foreground">Flowering:</span> <span className="font-medium">{pm.flowering_period}</span></div>)}
                        {pm.planting_time && (<div><span className="text-muted-foreground">Planting Time:</span> <span className="font-medium">{pm.planting_time}</span></div>)}
                        {pm.pests_diseases && (<div className="sm:col-span-2"><span className="text-muted-foreground">Pests/Diseases:</span> <span className="font-medium">{pm.pests_diseases}</span></div>)}
                        {pm.position && (<div className="sm:col-span-2"><span className="text-muted-foreground">Position:</span> <span className="font-medium">{pm.position}</span></div>)}
                        {pm.notes && (<div className="sm:col-span-2"><span className="text-muted-foreground">Notes:</span> <span className="font-medium">{pm.notes}</span></div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editZone} onOpenChange={(o) => { if (!o) setEditZone(null); }}>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Edit zone</DialogTitle>
            <DialogDescription>Update the name and plants for this zone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Plants in this section</Label>
              <PlantMaterialMultiSelect
                options={plantmaterial.map(pm => ({ id: pm.id, label: pm.common_name || pm.scientific_name || `#${pm.id}` }))}
                isLoading={pmLoading}
                value={editPlants}
                onChange={setEditPlants}
                placeholder="Type to search and select plants"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditZone(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredZones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No zones found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Zones;