import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, MapPin, Sun, Droplets, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useZones } from '@/hooks/useZones';
import { useClients } from '@/hooks/useClients';
import { usePlantMaterial } from '@/hooks/usePlantMaterial';
import { ZoneForm } from '@/components/ZoneForm';
import { useState } from 'react';

export default function ZoneDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { zones, updateZone } = useZones();
  const { clients } = useClients();
  const { plantmaterial } = usePlantMaterial();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddPlantDialogOpen, setIsAddPlantDialogOpen] = useState(false);
  const [selectedPlantNames, setSelectedPlantNames] = useState<string[]>([]);

  const zone = zones.find(z => z.id === id);

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Zone not found</p>
        <Button onClick={() => navigate('/zones')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Zones
        </Button>
      </div>
    );
  }

  const formatLastWatered = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return '—';
    }
  };

  const formatAreaSize = () => {
    if (!zone.area_size_value || !zone.area_size_unit) return 'Not specified';
    return `${zone.area_size_value} ${zone.area_size_unit}`;
  };

  const formatSunExposure = () => {
    if (!zone.sun_primary) return 'Not specified';
    
    const modifiers = zone.sun_modifiers || [];
    let exposure = zone.sun_primary;
    if (modifiers.length > 0) {
      exposure += ` · ${modifiers.join(', ')}`;
    }
    
    return exposure;
  };

  const handleUpdateZone = (data: any) => {
    updateZone.mutate({
      id: zone.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };

  const handleAddPlant = () => {
    // This would typically update the zone_plantmaterial table
    // For now, we'll just close the dialog and reset selection
    setIsAddPlantDialogOpen(false);
    setSelectedPlantNames([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/zones')}
            className="rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Zones
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">{zone.name}</h1>
            {zone.client && (
              <Badge variant="secondary" className="mt-1 rounded-full">
                {zone.client.name}
              </Badge>
            )}
          </div>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Edit className="w-4 h-4 mr-2" />
              Edit Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
            </DialogHeader>
            <ZoneForm
              zone={zone}
              clients={clients.map(c => ({ id: c.id, name: c.name }))}
              onSubmit={handleUpdateZone}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateZone.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Attributes */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zone Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Soil Type</h4>
              <p className="text-sm">
                {zone.soil_type_enum === 'Other' && zone.soil_type_other 
                  ? zone.soil_type_other 
                  : zone.soil_type_enum || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Area Size</h4>
              <p className="text-sm">{formatAreaSize()}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Sun Exposure</h4>
              <p className="text-sm">{formatSunExposure()}</p>
              {zone.sun_hours_estimate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated: {zone.sun_hours_estimate} hours/day
                </p>
              )}
            </div>

            {zone.sun_notes && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Sun Notes</h4>
                <p className="text-sm">{zone.sun_notes}</p>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Last watered:</strong> {formatLastWatered(zone.last_watered_at)}
                </span>
              </div>
            </div>

            {zone.notes && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">General Notes</h4>
                <div className="text-sm bg-muted/50 p-3 rounded-lg">
                  {zone.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plants in Zone */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Plants in this Zone
              </CardTitle>
              <Dialog open={isAddPlantDialogOpen} onOpenChange={setIsAddPlantDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Plants to Zone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Select plant materials to add to this zone. This feature is coming soon!
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddPlantDialogOpen(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddPlant}
                        className="rounded-lg"
                        disabled
                      >
                        Add Plants
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {zone.plants && zone.plants.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {zone.plants.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{plant.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sun className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No plants in this zone yet.</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Click "Add Plant" to start planting!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}