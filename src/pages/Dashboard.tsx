import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckSquare, Clock, AlertCircle } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useTasks } from "@/hooks/useTasks";
import { useZones } from "@/hooks/useZones";

const Dashboard = () => {
  const { clients } = useClients();
  const { tasks } = useTasks();
  const { zones } = useZones();

  // Calculate real stats from actual data
  const todaysVisits: any[] = []; // No visits implementation yet
  const urgentTasks = tasks.filter(task => 
    task.status === 'pending' && 
    task.priority === 'high'
  ).slice(0, 3);

  const stats = [
    { label: "Today's Visits", value: todaysVisits.length.toString(), icon: Calendar },
    { label: "Active Clients", value: clients.filter(c => c.status === 'active').length.toString(), icon: Users },
    { label: "Pending Tasks", value: tasks.filter(t => t.status === 'pending').length.toString(), icon: CheckSquare },
    { label: "Zones Managed", value: zones.length.toString(), icon: MapPin }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Today's Visits</span>
            </CardTitle>
            <CardDescription>Your scheduled client visits for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysVisits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No visits scheduled for today</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Schedule Visit
                  </Button>
                </div>
              ) : (
                todaysVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{visit.clientName}</h4>
                        <Badge variant={visit.priority === 'high' ? 'destructive' : 'secondary'}>
                          {visit.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {visit.address}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm">{visit.time}</span>
                        <span className="text-sm text-muted-foreground">
                          • {visit.zones.join(", ")}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Urgent Tasks</span>
            </CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No urgent tasks</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Create Task
                  </Button>
                </div>
              ) : (
                urgentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.client?.name} • Due {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              Add Client
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckSquare className="w-6 h-6 mb-2" />
              Create Task
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MapPin className="w-6 h-6 mb-2" />
              Add Zone
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              Schedule Visit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;