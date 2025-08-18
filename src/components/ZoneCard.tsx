import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Edit2, Eye, MapPin, Sun, Trash2 } from 'lucide-react';
import { Zone } from '@/hooks/useZones';

interface ZoneCardProps {
  zone: Zone;
  onEdit: (zone: Zone) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone, onEdit, onDelete, onViewDetails }) => {
  const formatLastWatered = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return '—';
    }
  };

  const formatAreaSize = () => {
    if (!zone.area_size_value || !zone.area_size_unit) return null;
    return `${zone.area_size_value} ${zone.area_size_unit}`;
  };

  const formatSunExposure = () => {
    if (!zone.sun_primary) return null;
    
    const modifiers = zone.sun_modifiers?.slice(0, 3) || [];
    const additionalCount = (zone.sun_modifiers?.length || 0) - 3;
    
    let exposure = zone.sun_primary;
    if (modifiers.length > 0) {
      exposure += ` · ${modifiers.join(', ')}`;
      if (additionalCount > 0) {
        exposure += ` +${additionalCount} more`;
      }
    }
    
    return exposure;
  };

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{zone.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(zone.id)}
              className="rounded-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(zone)}
              className="rounded-lg"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(zone.id)}
              className="rounded-lg text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Soil Type */}
        {zone.soil_type_enum && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="rounded-full">
              {zone.soil_type_enum === 'Other' && zone.soil_type_other 
                ? zone.soil_type_other 
                : zone.soil_type_enum}
            </Badge>
          </div>
        )}

        {/* Area Size */}
        {formatAreaSize() && (
          <div className="text-sm text-muted-foreground">
            <strong>Area:</strong> {formatAreaSize()}
          </div>
        )}

        {/* Sun Exposure */}
        {formatSunExposure() && (
          <div className="flex items-start gap-2">
            <Sun className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              {formatSunExposure()}
            </div>
          </div>
        )}

        {/* Plant Count */}
        {zone.plant_count > 0 && (
          <div className="text-sm text-muted-foreground">
            <strong>Plants:</strong> {zone.plant_count}
          </div>
        )}

        {/* Last Watered */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <strong>Last watered:</strong> {formatLastWatered(zone.last_watered_at)}
          </span>
        </div>

        {/* Notes */}
        {zone.notes && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
            {zone.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};