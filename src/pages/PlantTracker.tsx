import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import {
  Sprout,
  Calendar,
  Droplets,
  Sun,
  Scissors,
  Plus,
  Camera,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface Plant {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  health: "healthy" | "attention" | "critical";
  image?: string;
  notes: string;
}

interface Task {
  id: string;
  plantId?: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const PlantTracker = () => {
  const [zones, setZones] = useState({
    zoneA: {
      name: "Indoor Garden",
      plants: [
        {
          id: "1",
          name: "Cherry Tomato",
          variety: "Sweet 100",
          plantedDate: "2024-03-15",
          health: "healthy" as const,
          notes: "Growing well, needs pruning soon"
        },
        {
          id: "2",
          name: "Basil",
          variety: "Genovese",
          plantedDate: "2024-03-20",
          health: "healthy" as const,
          notes: "Ready for first harvest"
        }
      ] as Plant[]
    },
    zoneB: {
      name: "Outdoor Plot",
      plants: [
        {
          id: "3",
          name: "Cucumber",
          variety: "Boston Pickling",
          plantedDate: "2024-04-01",
          health: "attention" as const,
          notes: "Leaves showing spots, needs inspection"
        }
      ] as Plant[]
    }
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      plantId: "1",
      title: "Prune Tomato",
      description: "Remove suckers and lower branches",
      dueDate: "2024-08-05",
      completed: false,
      priority: "medium"
    },
    {
      id: "t2",
      plantId: "2",
      title: "Harvest Basil",
      description: "Cut top 6 leaves to encourage growth",
      dueDate: "2024-08-03",
      completed: false,
      priority: "high"
    },
    {
      id: "t3",
      plantId: "3",
      title: "Check Cucumber Leaves",
      description: "Inspect for disease and treat if needed",
      dueDate: "2024-08-04",
      completed: false,
      priority: "high"
    },
    {
      id: "t4",
      title: "Water All Plants",
      description: "Deep watering session for all zones",
      dueDate: "2024-08-06",
      completed: false,
      priority: "medium"
    }
  ]);

  const [draggedPlant, setDraggedPlant] = useState<Plant | null>(null);
  const [showAddPlant, setShowAddPlant] = useState<string | null>(null);

  const getHealthColor = (health: Plant["health"]) => {
    switch (health) {
      case "healthy": return "bg-green-500";
      case "attention": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  const getTaskIcon = (title: string) => {
    if (title.toLowerCase().includes("water")) return <Droplets className="w-4 h-4" />;
    if (title.toLowerCase().includes("prune")) return <Scissors className="w-4 h-4" />;
    if (title.toLowerCase().includes("harvest")) return <Sprout className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const handleDragStart = (plant: Plant, sourceZone: string) => {
    setDraggedPlant({ ...plant, sourceZone } as any);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetZone: "zoneA" | "zoneB") => {
    e.preventDefault();
    if (!draggedPlant) return;

    const sourceZone = (draggedPlant as any).sourceZone;
    if (sourceZone === targetZone) return;

    // Remove from source zone
    setZones(prev => ({
      ...prev,
      [sourceZone]: {
        ...prev[sourceZone as keyof typeof prev],
        plants: prev[sourceZone as keyof typeof prev].plants.filter(p => p.id !== draggedPlant.id)
      },
      [targetZone]: {
        ...prev[targetZone],
        plants: [...prev[targetZone].plants, draggedPlant].slice(0, 5) // Max 5 plants per zone
      }
    }));

    setDraggedPlant(null);
  };

  const markTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Plant & Zone Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your plants across different growing zones and stay on top of garden tasks
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plant Zones Section */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(zones).map(([zoneKey, zone]) => (
              <Card key={zoneKey} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold">{zone.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {zone.plants.length}/5 plants
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddPlant(zoneKey)}
                      disabled={zone.plants.length >= 5}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent 
                  className="p-6"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zoneKey as "zoneA" | "zoneB")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {zone.plants.map((plant) => (
                      <Card 
                        key={plant.id} 
                        className="cursor-move hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-primary/20"
                        draggable
                        onDragStart={() => handleDragStart(plant, zoneKey)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getHealthColor(plant.health)}`} />
                              <Badge variant="secondary" className="text-xs">
                                {plant.variety}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="mb-3">
                            <h4 className="font-semibold text-base mb-1">{plant.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Planted {new Date(plant.plantedDate).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Camera className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Droplets className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Sun className="w-3 h-3" />
                            </Button>
                          </div>

                          {plant.notes && (
                            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                              {plant.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: 5 - zone.plants.length }).map((_, index) => (
                      <Card 
                        key={`empty-${index}`} 
                        className="border-dashed border-2 border-muted-foreground/30 bg-muted/20"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, zoneKey as "zoneA" | "zoneB")}
                      >
                        <CardContent className="p-4 flex items-center justify-center h-32">
                          <div className="text-center text-muted-foreground">
                            <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Empty Slot</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => (
                  <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTaskIcon(task.title)}
                          <h4 className="font-medium text-sm">{task.title}</h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => markTaskComplete(task.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        {task.plantId && (
                          <Badge variant="outline" className="text-xs">
                            Plant Task
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Garden Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {zones.zoneA.plants.length + zones.zoneB.plants.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Plants</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {upcomingTasks.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending Tasks</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Plant Health</h5>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Healthy: 2</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Attention: 1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantTracker;