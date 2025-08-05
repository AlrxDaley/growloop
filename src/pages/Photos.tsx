import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Camera, Calendar, MapPin, User, Search, Plus, Download } from "lucide-react";

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // No photos in database yet - show empty state
  const photos: any[] = [];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.plant?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && photo.tags?.includes(filterType);
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

      {/* Photos Grid - Show empty state since no photos exist */}
      <div className="text-center py-12">
        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">No photos uploaded yet</p>
        <p className="text-sm text-muted-foreground mb-4">Start documenting your garden progress by adding your first photo</p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Photo
        </Button>
      </div>
    </div>
  );
};

export default Photos;