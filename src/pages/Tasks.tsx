import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Clock, Calendar, User, MapPin, Plus, Filter } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const { tasks, isLoading, completeTask } = useTasks();

  const getFilteredTasks = (status: string) => {
    if (status === "all") return tasks;
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

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
                <span className="text-muted-foreground">{task.client?.name}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{task.zone?.name || 'No zone'}</span>
              </div>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                {task.estimated_time_minutes ? `${task.estimated_time_minutes} min` : 'No estimate'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
          {task.status === "pending" ? (
            <>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => completeTask.mutate(task.id)}
                disabled={completeTask.isPending}
              >
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