import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Camera, Calendar, MapPin, User, Search, Plus, Download } from "lucide-react";

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock photos data
  const photos = [
    {
      id: 1,
      url: "/api/placeholder/300/200",
      title: "Tomato Growth Progress",
      description: "Week 4 - First flowers appearing",
      client: "Sarah Johnson",
      zone: "Vegetable Garden",
      plant: "Tomatoes",
      dateTaken: "2024-01-18",
      tags: ["progress", "flowering"]
    },
    {
      id: 2,
      url: "/api/placeholder/300/200",
      title: "Rose Pruning - Before",
      description: "Before winter pruning session",
      client: "Mike Chen",
      zone: "Front Garden",
      plant: "Roses",
      dateTaken: "2024-01-15",
      tags: ["before", "pruning"]
    },
    {
      id: 3,
      url: "/api/placeholder/300/200",
      title: "New Herb Plantings",
      description: "Fresh basil and oregano seedlings",
      client: "Mike Chen",
      zone: "Herb Patch",
      plant: "Mixed Herbs",
      dateTaken: "2024-01-12",
      tags: ["new planting", "seedlings"]
    },
    {
      id: 4,
      url: "/api/placeholder/300/200",
      title: "Pest Damage - Aphids",
      description: "Aphid infestation on rose leaves",
      client: "Emma Davis",
      zone: "Border Beds",
      plant: "Roses",
      dateTaken: "2024-01-10",
      tags: ["problem", "pests", "diagnosis"]
    },
    {
      id: 5,
      url: "/api/placeholder/300/200",
      title: "Successful Harvest",
      description: "First lettuce harvest of the season",
      client: "Sarah Johnson",
      zone: "Vegetable Garden",
      plant: "Lettuce",
      dateTaken: "2024-01-08",
      tags: ["harvest", "success"]
    },
    {
      id: 6,
      url: "/api/placeholder/300/200",
      title: "Soil Preparation",
      description: "Preparing bed for spring planting",
      client: "Emma Davis",
      zone: "Shade Border",
      plant: "N/A",
      dateTaken: "2024-01-05",
      tags: ["soil", "preparation"]
    }
  ];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.plant.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && photo.tags.includes(filterType);
  });

  const getTagColor = (tag: string): "default" | "destructive" | "outline" | "secondary" => {
    const tagColors: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      "progress": "default",
      "problem": "destructive",
      "success": "default",
      "before": "secondary",
      "after": "default",
      "diagnosis": "destructive",
      "harvest": "default",
      "new planting": "default"
    };
    return tagColors[tag] || "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Plant Photos</h2>
          <p className="text-muted-foreground">Track plant progress and document garden changes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "progress", "problem", "success", "diagnosis"].map((filter) => (
            <Button
              key={filter}
              variant={filterType === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {/* Photo */}
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Camera className="w-12 h-12 text-green-400" />
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {new Date(photo.dateTaken).toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{photo.title}</CardTitle>
              <CardDescription>{photo.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Location Info */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{photo.client}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">{photo.zone}</span>
                  </div>
                  {photo.plant !== "N/A" && (
                    <div className="flex items-center">
                      <span className="w-3 h-3 mr-2 text-muted-foreground">🌱</span>
                      <span className="text-muted-foreground">{photo.plant}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {photo.tags.map((tag, index) => (
                    <Badge key={index} variant={getTagColor(tag)} className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Full
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

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No photos found matching your search.</p>
          <Button className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default Photos;