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
  const featureCategories = [
    {
      title: "Essential Tracking",
      subtitle: "Core features for every gardener",
      badge: "Free",
      badgeVariant: "secondary" as const,
      features: [
        {
          icon: <Sprout className="w-5 h-5" />,
          title: "Plant & Zone Tracking",
          description: "Track up to 10 plants across 2 active garden zones"
        },
        {
          icon: <Camera className="w-5 h-5" />,
          title: "Photo Journal",
          description: "Add notes and upload photos to document your garden's journey"
        },
        {
          icon: <Bell className="w-5 h-5" />,
          title: "Manual Reminders",
          description: "Set custom reminders for watering, feeding, and care tasks"
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          title: "Planting Calendar",
          description: "Regional planting calendar based on your location"
        },
        {
          icon: <Download className="w-5 h-5" />,
          title: "Export to CSV",
          description: "Export your garden data for backup or analysis"
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          title: "Web & Mobile Access",
          description: "Access your garden from any device, anywhere"
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Ad-Free Experience",
          description: "No ads, no spam - just your garden data"
        }
      ]
    },
    {
      title: "Smart Growing",
      subtitle: "Advanced tools for active gardeners",
      badge: "Grower",
      badgeVariant: "default" as const,
      features: [
        {
          icon: <TreePine className="w-5 h-5" />,
          title: "Unlimited Plants & Zones",
          description: "Track unlimited plants across unlimited garden zones"
        },
        {
          icon: <Target className="w-5 h-5" />,
          title: "Smart Reminders",
          description: "AI-powered reminders for watering, feeding, and pruning"
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: "Plant Library",
          description: "Reuse past plant entries and build your growing knowledge"
        },
        {
          icon: <Download className="w-5 h-5" />,
          title: "Printable Layouts",
          description: "Generate beautiful garden layout prints"
        },
        {
          icon: <Layout className="w-5 h-5" />,
          title: "Zone Templates",
          description: "Pre-made templates like 4x4 veggie patches"
        },
        {
          icon: <Palette className="w-5 h-5" />,
          title: "Multiple Gardens",
          description: "Manage multiple locations like home garden and allotment"
        }
      ]
    },
    {
      title: "Master Gardener",
      subtitle: "Professional-grade gardening intelligence",
      badge: "Master",
      badgeVariant: "destructive" as const,
      features: [
        {
          icon: <Brain className="w-5 h-5" />,
          title: "AI Plant Health Scan",
          description: "Upload photos for instant plant disease and pest diagnosis"
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          title: "PlantPal Assistant",
          description: "Chat with AI for personalized growing advice"
        },
        {
          icon: <BarChart3 className="w-5 h-5" />,
          title: "Garden Analytics",
          description: "Track yield history, success rates, and garden performance"
        },
        {
          icon: <Wifi className="w-5 h-5" />,
          title: "Offline Mode",
          description: "Access your garden data even without internet connection"
        },
        {
          icon: <MapPin className="w-5 h-5" />,
          title: "Microclimate Tracking",
          description: "Track specific conditions for each garden zone"
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: "Community Alerts",
          description: "Get local disease and pest alerts from other gardeners"
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: "Season Summary Reports",
          description: "Beautiful PDF reports of your growing season"
        }
      ]
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Everything You Need to Grow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From your first seedling to master harvests, CropTrackr grows with you. 
            Start free and unlock advanced features as your garden expertise develops.
          </p>
        </div>

        <div className="space-y-16">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    {category.title}
                  </h3>
                  <Badge variant={category.badgeVariant} className="text-sm px-3 py-1">
                    {category.badge}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">{category.subtitle}</p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Card 
                    key={featureIndex} 
                    className="hover:shadow-card transition-all duration-300 hover:transform hover:scale-105 group animate-scale-in"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (featureIndex * 0.1)}s` }}
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
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 p-12 bg-gradient-primary rounded-2xl">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Ready to Transform Your Garden?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of gardeners already growing smarter with CropTrackr's intelligent features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground hover:bg-background/90 h-11 px-8 text-lg"
            >
              View Pricing Plans
            </a>
            <a 
              href="#demo" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 text-white hover:bg-white/20 h-11 px-8 text-lg"
            >
              Try Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;