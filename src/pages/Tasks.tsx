import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Clock, Calendar, User, MapPin, Plus, Filter } from "lucide-react";

const Tasks = () => {
  const [filter, setFilter] = useState("all");

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: "Water tomato plants",
      description: "Check soil moisture and water if needed",
      client: "Sarah Johnson",
      zone: "Vegetable Garden",
      dueDate: "2024-01-20",
      priority: "high",
      status: "pending",
      recurring: true,
      estimatedTime: "30 min"
    },
    {
      id: 2,
      title: "Prune rose bushes",
      description: "Annual winter pruning for rose garden",
      client: "Mike Chen",
      zone: "Front Garden",
      dueDate: "2024-01-22",
      priority: "medium",
      status: "pending",
      recurring: false,
      estimatedTime: "2 hours"
    },
    {
      id: 3,
      title: "Plant spring bulbs",
      description: "Plant tulip and daffodil bulbs in designated areas",
      client: "Emma Davis",
      zone: "Border Beds",
      dueDate: "2024-01-18",
      priority: "low",
      status: "completed",
      recurring: false,
      estimatedTime: "1 hour"
    },
    {
      id: 4,
      title: "Apply winter fertilizer",
      description: "Slow-release fertilizer for lawn areas",
      client: "Sarah Johnson",
      zone: "Lawn",
      dueDate: "2024-01-25",
      priority: "medium",
      status: "pending",
      recurring: true,
      estimatedTime: "45 min"
    }
  ];

  const getFilteredTasks = (status: string) => {
    if (status === "all") return tasks;
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{task.title}</span>
              {task.recurring && (
                <Badge variant="outline" className="text-xs">
                  Recurring
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {task.description}
            </CardDescription>
          </div>
          <Badge variant={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Client and Zone */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{task.client}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{task.zone}</span>
              </div>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{task.estimatedTime}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            {task.status === "pending" ? (
              <>
                <Button size="sm" className="flex-1">
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Complete
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Tasks</h2>
          <p className="text-muted-foreground">Manage your garden maintenance tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({getFilteredTasks("pending").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getFilteredTasks("completed").length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Tasks ({tasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredTasks("pending").map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredTasks("completed").map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;