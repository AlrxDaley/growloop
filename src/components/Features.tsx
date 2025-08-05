import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  Camera,
  Brain,
  Bell,
  Calendar,
  Download,
  Smartphone,
  Shield,
  BarChart3,
  Wifi,
  MapPin,
  Users,
  FileText,
  Layout,
  Palette,
  TreePine,
  Target,
  MessageCircle
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Client Management",
      description: "Organize and track all your clients with detailed profiles and contact information",
      link: "/clients"
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: "Zone Management", 
      description: "Create and manage different zones or areas for organized project tracking",
      link: "/zones"
    },
    {
      icon: <Sprout className="w-5 h-5" />,
      title: "Plant Tracking",
      description: "Monitor plant health, growth stages, and maintenance schedules",
      link: "/plant-tracker"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Task Management",
      description: "Create, assign, and track tasks with deadlines and priority levels",
      link: "/tasks"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Scheduling System",
      description: "Plan visits, appointments, and maintenance schedules efficiently",
      link: "/schedule"
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photo Documentation",
      description: "Capture and organize photos to document progress and issues",
      link: "/photos"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Dashboard Analytics",
      description: "Get insights into your business with comprehensive reporting and metrics",
      link: "/dashboard"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Mobile Access",
      description: "Access your CRM from any device with responsive web design"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Data Export",
      description: "Export your data for backup, analysis, or integration with other tools"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Powerful CRM Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your business operations with comprehensive tools designed for efficiency and growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, featureIndex) => (
            <Card 
              key={featureIndex} 
              className={`hover:shadow-card transition-all duration-300 hover:transform hover:scale-105 group animate-scale-in ${feature.link ? 'cursor-pointer' : ''}`}
              style={{ animationDelay: `${featureIndex * 0.1}s` }}
              onClick={feature.link ? () => window.location.href = feature.link : undefined}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <div className="text-primary-foreground">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 p-12 bg-gradient-primary rounded-2xl">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Ready to Streamline Your Business?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join businesses already growing smarter with our comprehensive CRM solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signin" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground hover:bg-background/90 h-11 px-8 text-lg"
            >
              Get Started
            </a>
            <a 
              href="/dashboard" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 text-white hover:bg-white/20 h-11 px-8 text-lg"
            >
              View Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;