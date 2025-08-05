import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Thermometer, Droplets, Sun, Search, Plus, User } from "lucide-react";

const Zones = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock zones data
  const zones = [
    {
      id: 1,
      name: "Front Garden",
      client: "Sarah Johnson",
      size: "200 sq ft",
      plantCount: 15,
      soilType: "Clay",
      sunlight: "Full Sun",
      wateringSchedule: "3x/week",
      lastMaintenance: "2024-01-15",
      plants: ["Roses", "Lavender", "Hostas"],
      notes: "Recently added automatic irrigation"
    },
    {
      id: 2,
      name: "Vegetable Garden",
      client: "Sarah Johnson",
      size: "400 sq ft",
      plantCount: 28,
      soilType: "Loam",
      sunlight: "Full Sun",
      wateringSchedule: "Daily",
      lastMaintenance: "2024-01-18",
      plants: ["Tomatoes", "Peppers", "Lettuce", "Carrots"],
      notes: "Peak growing season, monitor for pests"
    },
    {
      id: 3,
      name: "Herb Patch",
      client: "Mike Chen",
      size: "50 sq ft",
      plantCount: 8,
      soilType: "Sandy",
      sunlight: "Partial Sun",
      wateringSchedule: "2x/week",
      lastMaintenance: "2024-01-12",
      plants: ["Basil", "Rosemary", "Thyme", "Oregano"],
      notes: "Harvest regularly to encourage growth"
    },
    {
      id: 4,
      name: "Shade Border",
      client: "Emma Davis",
      size: "150 sq ft",
      plantCount: 12,
      soilType: "Clay",
      sunlight: "Shade",
      wateringSchedule: "2x/week",
      lastMaintenance: "2024-01-10",
      plants: ["Ferns", "Astilbe", "Heuchera"],
      notes: "New planting, monitor establishment"
    }
  ];

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
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
                    {zone.client}
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
                    <p className="font-semibold">{zone.plantCount}</p>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      {getSunlightIcon(zone.sunlight)}
                      <span className="ml-2 text-muted-foreground">{zone.sunlight}</span>
                    </div>
                    <span className="text-muted-foreground">{zone.soilType} soil</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-muted-foreground">Water: {zone.wateringSchedule}</span>
                  </div>
                </div>

                {/* Plants */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Plants:</p>
                  <div className="flex flex-wrap gap-1">
                    {zone.plants.slice(0, 3).map((plant, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {plant}
                      </Badge>
                    ))}
                    {zone.plants.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{zone.plants.length - 3} more
                      </Badge>
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
                  Last maintained: {new Date(zone.lastMaintenance).toLocaleDateString()}
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