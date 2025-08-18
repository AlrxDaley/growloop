import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MaterialsMultiSelectDropdown } from '@/components/MaterialsMultiSelectDropdown';

const MaterialsDemo = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'Rose', 'Lavender', 'Basil'
  ]);
  const [disabledSelection, setDisabledSelection] = useState<string[]>([]);
  const [errorSelection, setErrorSelection] = useState<string[]>([]);

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Materials Multi-Select Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of the MaterialsMultiSelectDropdown component with various states and configurations.
        </p>
      </div>

      {/* Standard Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Usage</CardTitle>
          <CardDescription>
            Basic multi-select dropdown with plant materials from the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Plant Materials</label>
            <MaterialsMultiSelectDropdown
              values={selectedMaterials}
              onChange={setSelectedMaterials}
              placeholder="Choose your favorite plants..."
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Values:</p>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm">
                {selectedMaterials.length > 0 
                  ? `["${selectedMaterials.join('", "')}"]`
                  : "[]"
                }
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Formatted Output:</p>
            <p className="text-sm text-muted-foreground">
              {selectedMaterials.length > 0 
                ? selectedMaterials.join(", ")
                : "No materials selected"
              }
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedMaterials([
                'Rose', 'Tulip', 'Daffodil', 'Sunflower', 'Daisy'
              ])}
            >
              Preset: Flowers
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedMaterials([
                'Basil', 'Rosemary', 'Thyme', 'Oregano', 'Parsley'
              ])}
            >
              Preset: Herbs
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedMaterials([])}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disabled State */}
      <Card>
        <CardHeader>
          <CardTitle>Disabled State</CardTitle>
          <CardDescription>
            Component in disabled state with some pre-selected values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Disabled Dropdown</label>
            <MaterialsMultiSelectDropdown
              values={disabledSelection}
              onChange={setDisabledSelection}
              placeholder="This dropdown is disabled"
              disabled={true}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDisabledSelection(['Disabled Plant A', 'Disabled Plant B'])}
          >
            Set Disabled Values
          </Button>
        </CardContent>
      </Card>

      {/* Custom Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Configuration</CardTitle>
          <CardDescription>
            Customized chip limit and menu height settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chip Limit: 2, Max Height: 180px</label>
            <MaterialsMultiSelectDropdown
              values={selectedMaterials}
              onChange={setSelectedMaterials}
              placeholder="Custom configuration..."
              chipLimit={2}
              maxMenuHeight={180}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error State Simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Error State</CardTitle>
          <CardDescription>
            This would show error state if there were database connection issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Error Handling</label>
            <MaterialsMultiSelectDropdown
              values={errorSelection}
              onChange={setErrorSelection}
              placeholder="Check for error states in component"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            The component automatically handles loading states, error states, and empty states from the database query.
          </p>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
          <CardDescription>
            Overview of all implemented features and capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Data Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fetches from plantmaterial table</li>
                <li>• DISTINCT values, null-filtered</li>
                <li>• Alphabetical sorting</li>
                <li>• Cached data with React Query</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">User Experience</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-select with checkmarks</li>
                <li>• Menu stays open for continuous selection</li>
                <li>• Chip display with overflow handling</li>
                <li>• Clear all functionality</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Accessibility</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full keyboard navigation</li>
                <li>• ARIA attributes for screen readers</li>
                <li>• Focus management</li>
                <li>• Escape key handling</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Search/filter functionality</li>
                <li>• Loading and error states</li>
                <li>• Configurable chip limits</li>
                <li>• Rounded, scrollable design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsDemo;