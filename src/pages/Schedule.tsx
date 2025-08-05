import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");

  // Mock schedule data
  const events = [
    {
      id: 1,
      title: "Morning Garden Check",
      client: "Sarah Johnson",
      zone: "Vegetable Garden",
      time: "09:00",
      duration: "30 min",
      date: "2024-01-20",
      type: "visit",
      priority: "high"
    },
    {
      id: 2,
      title: "Rose Pruning",
      client: "Mike Chen",
      zone: "Front Garden",
      time: "14:00",
      duration: "2 hours",
      date: "2024-01-20",
      type: "task",
      priority: "medium"
    },
    {
      id: 3,
      title: "Soil Testing",
      client: "Emma Davis",
      zone: "Shade Border",
      time: "10:00",
      duration: "45 min",
      date: "2024-01-21",
      type: "assessment",
      priority: "low"
    },
    {
      id: 4,
      title: "Weekly Maintenance",
      client: "Sarah Johnson",
      zone: "All Zones",
      time: "08:00",
      duration: "3 hours",
      date: "2024-01-22",
      type: "maintenance",
      priority: "high"
    }
  ];

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getTypeColor = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    const colors: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      "visit": "default",
      "task": "secondary",
      "assessment": "outline",
      "maintenance": "default"
    };
    return colors[type] || "secondary";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  const weekDays = getWeekDays(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Schedule</h2>
          <p className="text-muted-foreground">Manage your garden visits and tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setView(view === "week" ? "month" : "week")}>
            {view === "week" ? "Month View" : "Week View"}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateWeek('prev')}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          Week of {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <Button variant="outline" onClick={() => navigateWeek('next')}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <Card key={index} className={`min-h-[300px] ${isToday ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-center">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </CardTitle>
                <CardDescription className="text-center">
                  <span className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}>
                    {day.getDate()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded-lg border-l-4 ${getPriorityColor(event.priority)} bg-card hover:bg-muted/50 transition-colors cursor-pointer`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-medium truncate">{event.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate">{event.client}</span>
                        </div>
                        <Badge variant={getTypeColor(event.type)} className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs py-4">
                      No events
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Today's Schedule</span>
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getEventsForDate(new Date()).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge variant={getTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{event.time} ({event.duration})</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{event.client}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{event.zone}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
            {getEventsForDate(new Date()).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events scheduled for today.</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Something
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;