import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlantMaterial } from '@/hooks/usePlantMaterial';

interface PlantMaterialMultiSelectProps {
  value: number[];
  onChange: (val: number[]) => void;
  placeholder?: string;
}

export const PlantMaterialMultiSelect = ({ value, onChange, placeholder = 'Select plants' }: PlantMaterialMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { plantmaterial, isLoading } = usePlantMaterial();

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  // Filter and sort plants alphabetically
  const filteredPlants = plantmaterial
    .filter(plant => {
      const displayName = plant.common_name || plant.scientific_name || '';
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.common_name || a.scientific_name || '';
      const nameB = b.common_name || b.scientific_name || '';
      return nameA.localeCompare(nameB);
    });

  const selectedPlants = plantmaterial.filter(plant => value.includes(plant.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex flex-wrap gap-1 items-center">
            {selectedPlants.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selectedPlants.map((plant) => (
              <Badge key={plant.id} variant="secondary" className="text-xs">
                {plant.common_name || plant.scientific_name}
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[1000]">
        <div className="flex flex-col h-80">
          {/* Search bar - fixed at top */}
          <div className="p-3 border-b bg-background">
            <Input
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Scrollable plant list */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground">Loading plants...</div>
            ) : filteredPlants.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {searchTerm ? 'No plants found matching your search.' : 'No plants available.'}
              </div>
            ) : (
              <div className="p-1 overflow-y-auto max-h-full">{/* Make scrollable */}
                {filteredPlants.map((plant) => {
                  const isSelected = value.includes(plant.id);
                  const displayName = plant.common_name || plant.scientific_name || 'Unknown Plant';
                  
                  return (
                    <div
                      key={plant.id}
                      onClick={() => toggle(plant.id)}
                      className="flex items-center space-x-2 px-2 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer"
                    >
                      <Check className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{displayName}</div>
                        {plant.common_name && plant.scientific_name && plant.common_name !== plant.scientific_name && (
                          <div className="text-xs text-muted-foreground italic">{plant.scientific_name}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
