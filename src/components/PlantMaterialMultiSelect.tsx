import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiOption {
  id: number;
  label: string;
}

interface PlantMaterialMultiSelectProps {
  options: MultiOption[];
  isLoading?: boolean;
  value: number[];
  onChange: (val: number[]) => void;
  placeholder?: string;
}

export const PlantMaterialMultiSelect = ({ options, isLoading = false, value, onChange, placeholder = 'Select plants' }: PlantMaterialMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (id: number) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id));
    else onChange([...value, id]);
  };

  const selected = options.filter(o => value.includes(o.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((s) => (
              <Badge key={s.id} variant="secondary" className="text-xs">{s.label}</Badge>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover z-[1000] max-h-[75vh] overflow-hidden">
        {isLoading ? (
          <div className="p-3 text-sm text-muted-foreground">Loading plants...</div>
        ) : options.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">No plants available</div>
        ) : (
          <Command className="overflow-hidden">
            <div className="px-3 py-2 border-b">
              <CommandInput placeholder="Type to search..." className="border-0 p-0 focus:ring-0" />
            </div>
            <ScrollArea className="max-h-72">
              <CommandList className="max-h-none">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => {
                    const active = value.includes(opt.id);
                    return (
                      <CommandItem key={opt.id} value={opt.label} onSelect={() => toggle(opt.id)} className="cursor-pointer">
                        <Check className={cn('mr-2 h-4 w-4', active ? 'opacity-100' : 'opacity-0')} />
                        {opt.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
