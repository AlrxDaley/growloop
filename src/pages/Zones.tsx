import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { useZones } from "@/hooks/useZones";
import { useClients } from "@/hooks/useClients";
import { ZoneForm } from "@/components/ZoneForm";
import { ZoneCard } from "@/components/ZoneCard";

export default function Zones() {
  const navigate = useNavigate();
  const { zones, createZone, updateZone, deleteZone, isLoading } = useZones();
  const { clients } = useClients();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateZone = (data: any) => {
    createZone.mutate(data, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      }
    });
  };

  const handleUpdateZone = (data: any) => {
    if (!editingZone) return;
    
    updateZone.mutate({
      id: editingZone.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingZone(null);
      }
    });
  };

  const handleEdit = (zone: any) => {
    setEditingZone(zone);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      deleteZone.mutate(id);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/zones/${id}`);
  };

  const handleCloseAdd = () => {
    setIsAddDialogOpen(false);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingZone(null);
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group zones by client
  const groupedZones = filteredZones.reduce((acc, zone) => {
    const clientName = zone.client?.name || 'Unassigned';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(zone);
    return acc;
  }, {} as Record<string, typeof zones>);

  // Sort client names alphabetically, but put "Unassigned" first
  const sortedClientNames = Object.keys(groupedZones).sort((a, b) => {
    if (a === 'Unassigned') return -1;
    if (b === 'Unassigned') return 1;
    return a.localeCompare(b);
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading zones...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Garden Zones</h2>
          <p className="text-muted-foreground">Manage garden zones with detailed soil and sun exposure information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Zone</DialogTitle>
            </DialogHeader>
            <ZoneForm
              clients={clients.map(c => ({ id: c.id, name: c.name }))}
              onSubmit={handleCreateZone}
              onCancel={handleCloseAdd}
              isLoading={createZone.isPending}
            />
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
          className="pl-10 rounded-lg"
        />
      </div>

      {/* Zones Grouped by Client */}
      {filteredZones.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No zones found matching your search." : "No zones created yet. Click 'Add Zone' to get started."}
          </p>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={sortedClientNames} className="space-y-4">
          {sortedClientNames.map((clientName) => (
            <AccordionItem key={clientName} value={clientName} className="border border-border rounded-xl">
              <AccordionTrigger className="px-6 py-4 hover:no-underline rounded-t-xl hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-left">
                    {clientName}
                  </h3>
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {groupedZones[clientName].length} zone{groupedZones[clientName].length !== 1 ? 's' : ''}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                  {groupedZones[clientName].map((zone) => (
                    <ZoneCard
                      key={zone.id}
                      zone={zone}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
          </DialogHeader>
          {editingZone && (
            <ZoneForm
              zone={editingZone}
              clients={clients.map(c => ({ id: c.id, name: c.name }))}
              onSubmit={handleUpdateZone}
              onCancel={handleCloseEdit}
              isLoading={updateZone.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}