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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

const Zones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { zones, isLoading, createZone } = useZones();
  const { clients } = useClients();

  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [sectionCount, setSectionCount] = useState<number>(1);
  const suggestedNames = ["Left Flower Bed", "Right Flower Bed", "Rear Flower Bed", "Front Flower Bed", "Potted Plants"];
  const [sectionNames, setSectionNames] = useState<Array<{ suggestion: string; custom: string }>>(
    [{ suggestion: suggestedNames[0], custom: "" }]
  );

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionCountChange = (count: number) => {
    setSectionCount(count);
    setSectionNames(prev => {
      const next = Array.from({ length: count }, (_, i) => ({
        suggestion: suggestedNames[i] ?? "",
        custom: prev[i]?.custom ?? ""
      }));
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
        names.map(name =>
          // @ts-ignore mutateAsync exists on the mutation object
          (createZone as any).mutateAsync({ client_id: selectedClientId, name, plant_count: 0 })
        )
      );
      setOpen(false);
      // reset form
      setSelectedClientId("");
      handleSectionCountChange(1);
      setSectionNames([{ suggestion: suggestedNames[0], custom: "" }]);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Failed to create zones.", variant: "destructive" });
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add zone(s)</DialogTitle>
              <DialogDescription>Link zones to a client and name each garden section.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger id="client">
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
                  <SelectTrigger id="sections">
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
                <Label>Section names</Label>
                <ScrollArea className="max-h-72 pr-3">
                  <div className="space-y-4">
                    {Array.from({ length: sectionCount }, (_, i) => (
                      <div key={i} className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="text-sm">Section {i + 1} (suggested)</Label>
                          <Select
                            value={sectionNames[i]?.suggestion ?? ""}
                            onValueChange={(v) =>
                              setSectionNames(prev => {
                                const next = [...prev];
                                next[i] = { suggestion: v, custom: prev[i]?.custom ?? "" };
                                return next;
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a suggested name" />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-popover">
                              {suggestedNames.map((name) => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                              ))}
                              <SelectItem value="">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Or custom name</Label>
                          <Input
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredZones.map((zone) => (
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
                    {zone.client?.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Zone Stats */}
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

                {/* Conditions */}
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

                {/* Plants */}
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

                {/* Notes */}
                {zone.notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                    {zone.notes}
                  </p>
                )}

                {/* Last Maintenance */}
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(zone.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredZones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No zones found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Zones;