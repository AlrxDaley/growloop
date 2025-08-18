import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown, X, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlantMaterial } from '@/hooks/usePlantMaterial';

interface MaterialsMultiSelectDropdownProps {
  values: string[];
  onChange: (nextValues: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxMenuHeight?: number;
  chipLimit?: number;
}

export const MaterialsMultiSelectDropdown: React.FC<MaterialsMultiSelectDropdownProps> = ({
  values,
  onChange,
  placeholder = "Select materials…",
  className,
  disabled = false,
  maxMenuHeight = 240,
  chipLimit = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { plantmaterial, isLoading, error } = usePlantMaterial();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Get distinct materials and sort alphabetically
  const materials = useMemo(() => {
    const distinctMaterials = new Set<string>();
    
    plantmaterial.forEach(plant => {
      const material = plant.common_name || plant.scientific_name;
      if (material && material.trim()) {
        distinctMaterials.add(material.trim());
      }
    });
    
    return Array.from(distinctMaterials).sort((a, b) => a.localeCompare(b));
  }, [plantmaterial]);

  // Filter materials based on search
  const filteredMaterials = useMemo(() => {
    if (!searchTerm.trim()) return materials;
    return materials.filter(material => 
      material.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredMaterials.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredMaterials.length - 1
        );
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(filteredMaterials.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredMaterials.length) {
          toggleMaterial(filteredMaterials[focusedIndex]);
        }
        break;
    }
  };

  const toggleMaterial = (material: string) => {
    const newValues = values.includes(material)
      ? values.filter(v => v !== material)
      : [...values, material];
    onChange(newValues);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange([...materials]);
  };

  const deselectAll = () => {
    onChange([]);
  };

  const removeMaterial = (material: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== material));
  };

  const displayedChips = values.slice(0, chipLimit);
  const remainingCount = values.length - chipLimit;

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Control */}
      <Button
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal rounded-lg h-auto min-h-10 px-3 py-2",
          !values.length && "text-muted-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="materials-listbox"
        aria-haspopup="listbox"
      >
        <div className="flex flex-wrap gap-1 items-center flex-1 min-w-0">
          {values.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {displayedChips.map((material) => (
                <Badge 
                  key={material} 
                  variant="secondary" 
                  className="text-xs rounded-full px-2 py-1 flex items-center gap-1"
                >
                  <span className="truncate max-w-24">{material}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={(e) => removeMaterial(material, e)}
                  />
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="outline" className="text-xs rounded-full">
                  +{remainingCount} more
                </Badge>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {values.length > 0 && (
            <X 
              className="h-4 w-4 cursor-pointer hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            />
          )}
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50"
          style={{ maxHeight: maxMenuHeight }}
        >
          {/* Search Bar */}
          <div className="p-2 border-b bg-background rounded-t-lg">
            <Input
              ref={searchRef}
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFocusedIndex(-1);
              }}
              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Action Buttons */}
          {materials.length <= 50 && (
            <div className="p-2 border-b flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={selectAll}
                className="text-xs"
                disabled={values.length === materials.length}
              >
                <Plus className="h-3 w-3 mr-1" />
                Select All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={deselectAll}
                className="text-xs"
                disabled={values.length === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Materials List */}
          <div 
            ref={listRef}
            className="overflow-y-auto"
            style={{ maxHeight: maxMenuHeight - 100 }}
            role="listbox"
            id="materials-listbox"
            aria-multiselectable="true"
          >
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Loading materials...
              </div>
            ) : error ? (
              <div className="p-3 text-sm text-destructive text-center">
                Error loading materials
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                {searchTerm ? 'No materials found matching your search.' : 'No materials available.'}
              </div>
            ) : (
              <div className="p-1">
                {filteredMaterials.map((material, index) => {
                  const isSelected = values.includes(material);
                  const isFocused = index === focusedIndex;
                  
                  return (
                    <div
                      key={material}
                      onClick={() => toggleMaterial(material)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer transition-colors",
                        isFocused && "bg-accent text-accent-foreground",
                        isSelected && "bg-muted"
                      )}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                    >
                      <Check 
                        className={cn(
                          'h-4 w-4 transition-opacity',
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                        )} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{material}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};