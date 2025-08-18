import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Zone } from '@/hooks/useZones';

const soilTypes = ['Clay', 'Loam', 'Sand', 'Silt', 'Chalk', 'Peat', 'Other'] as const;
const areaSizeUnits = ['m²', 'ft²', 'acre'] as const;
const sunExposures = [
  'Full sun (6+ h)',
  'Partial sun (3–6 h)',
  'Partial shade (3–6 h filtered)',
  'Dappled shade',
  'Full shade (<3 h)'
] as const;

const sunModifierOptions = [
  'Morning sun',
  'Afternoon sun',
  'East-facing',
  'South-facing',
  'West-facing',
  'North-facing',
  'Wind-exposed',
  'Sheltered'
] as const;

const zoneSchema = z.object({
  name: z.string().min(1, 'Zone name is required'),
  client_id: z.string().min(1, 'Client is required'),
  soil_type_enum: z.enum(soilTypes, { required_error: 'Soil type is required' }),
  soil_type_other: z.string().optional(),
  area_size_value: z.number().min(0.1, 'Area size must be greater than 0'),
  area_size_unit: z.enum(areaSizeUnits, { required_error: 'Area unit is required' }),
  sun_primary: z.enum(sunExposures, { required_error: 'Primary sun exposure is required' }),
  sun_modifiers: z.array(z.string()).default([]),
  sun_hours_estimate: z.number().min(0).max(24).optional().nullable(),
  sun_notes: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.soil_type_enum === 'Other' && !data.soil_type_other?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the soil type when "Other" is selected',
  path: ['soil_type_other'],
});

type ZoneFormData = z.infer<typeof zoneSchema>;

interface ZoneFormProps {
  zone?: Zone;
  clients: Array<{ id: string; name: string }>;
  onSubmit: (data: ZoneFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ZoneForm: React.FC<ZoneFormProps> = ({ 
  zone, 
  clients, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: zone?.name || '',
      client_id: zone?.client_id || '',
      soil_type_enum: zone?.soil_type_enum || undefined,
      soil_type_other: zone?.soil_type_other || '',
      area_size_value: zone?.area_size_value || undefined,
      area_size_unit: zone?.area_size_unit || undefined,
      sun_primary: zone?.sun_primary || undefined,
      sun_modifiers: zone?.sun_modifiers || [],
      sun_hours_estimate: zone?.sun_hours_estimate || null,
      sun_notes: zone?.sun_notes || '',
      notes: zone?.notes || '',
    },
  });

  const selectedSoilType = watch('soil_type_enum');
  const selectedModifiers = watch('sun_modifiers');

  const handleModifierToggle = (modifier: string) => {
    const current = selectedModifiers || [];
    const updated = current.includes(modifier)
      ? current.filter(m => m !== modifier)
      : [...current, modifier];
    setValue('sun_modifiers', updated);
  };

  const removeModifier = (modifier: string) => {
    const current = selectedModifiers || [];
    setValue('sun_modifiers', current.filter(m => m !== modifier));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{zone ? 'Edit Zone' : 'Add Zone'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Zone Name *</Label>
              <Input
                id="name"
                {...register('name')}
                className="rounded-lg"
                placeholder="Enter zone name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="client_id">Client *</Label>
              <Select 
                value={watch('client_id')} 
                onValueChange={(value) => setValue('client_id', value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-60 overflow-y-auto">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-sm text-destructive mt-1">{errors.client_id.message}</p>
              )}
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Soil Information</h3>
            <div>
              <Label htmlFor="soil_type_enum">Soil Type *</Label>
              <Select 
                value={watch('soil_type_enum')} 
                onValueChange={(value) => {
                  setValue('soil_type_enum', value as any);
                  if (value !== 'Other') {
                    setValue('soil_type_other', '');
                  }
                  trigger('soil_type_other');
                }}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-60 overflow-y-auto">
                  {soilTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.soil_type_enum && (
                <p className="text-sm text-destructive mt-1">{errors.soil_type_enum.message}</p>
              )}
            </div>

            {selectedSoilType === 'Other' && (
              <div>
                <Label htmlFor="soil_type_other">Specify Soil Type *</Label>
                <Input
                  id="soil_type_other"
                  {...register('soil_type_other')}
                  className="rounded-lg"
                  placeholder="Describe the soil type"
                />
                {errors.soil_type_other && (
                  <p className="text-sm text-destructive mt-1">{errors.soil_type_other.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Area Size */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Area Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area_size_value">Area Size *</Label>
                <Input
                  id="area_size_value"
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...register('area_size_value', { valueAsNumber: true })}
                  className="rounded-lg"
                  placeholder="0.0"
                />
                {errors.area_size_value && (
                  <p className="text-sm text-destructive mt-1">{errors.area_size_value.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="area_size_unit">Unit *</Label>
                <Select 
                  value={watch('area_size_unit')} 
                  onValueChange={(value) => setValue('area_size_unit', value as any)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {areaSizeUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area_size_unit && (
                  <p className="text-sm text-destructive mt-1">{errors.area_size_unit.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sun Exposure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sun Exposure</h3>
            <div>
              <Label htmlFor="sun_primary">Primary Exposure *</Label>
              <Select 
                value={watch('sun_primary')} 
                onValueChange={(value) => setValue('sun_primary', value as any)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select primary sun exposure" />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-60 overflow-y-auto">
                  {sunExposures.map((exposure) => (
                    <SelectItem key={exposure} value={exposure}>
                      {exposure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sun_primary && (
                <p className="text-sm text-destructive mt-1">{errors.sun_primary.message}</p>
              )}
            </div>

            <div>
              <Label>Sun Modifiers</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sunModifierOptions.map((modifier) => (
                  <button
                    key={modifier}
                    type="button"
                    onClick={() => handleModifierToggle(modifier)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      selectedModifiers?.includes(modifier)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {modifier}
                  </button>
                ))}
              </div>
              {selectedModifiers && selectedModifiers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedModifiers.map((modifier) => (
                    <Badge key={modifier} variant="secondary" className="rounded-full">
                      {modifier}
                      <button
                        type="button"
                        onClick={() => removeModifier(modifier)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="sun_hours_estimate">Estimated Hours of Direct Sun</Label>
              <Input
                id="sun_hours_estimate"
                type="number"
                step="0.5"
                min="0"
                max="24"
                {...register('sun_hours_estimate', { 
                  valueAsNumber: true,
                  setValueAs: (value) => value === '' ? null : value 
                })}
                className="rounded-lg"
                placeholder="5.5"
              />
              {errors.sun_hours_estimate && (
                <p className="text-sm text-destructive mt-1">{errors.sun_hours_estimate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sun_notes">Sun Exposure Notes</Label>
              <Textarea
                id="sun_notes"
                {...register('sun_notes')}
                className="rounded-lg"
                placeholder="Additional notes about sun exposure..."
                rows={2}
              />
            </div>
          </div>

          {/* General Notes */}
          <div>
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="rounded-lg"
              placeholder="Additional notes about this zone..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg"
            >
              {isLoading ? 'Saving...' : (zone ? 'Update Zone' : 'Create Zone')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};