import { Button } from "@/components/ui/button";
import { Sprout, Camera, Brain, Bell } from "lucide-react";
import heroImage from "@/assets/hero-garden.jpg";
const Hero = () => {
  const features = [{
    icon: Sprout,
    title: "Client Management",
    description: "Track client profiles, garden zones, and service history in one place"
  }, {
    icon: Camera,
    title: "Photo Documentation",
    description: "Log progress photos and maintain visual records for each project"
  }, {
    icon: Brain,
    title: "Task Scheduling",
    description: "Schedule visits, set reminders, and manage recurring maintenance tasks"
  }, {
    icon: Bell,
    title: "Mobile Dashboard",
    description: "Access today's schedule and client info on-the-go from any device"
  }];
  return <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 animate-grow">GrowLoop CRM
          </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2 font-light">
              Manage. Track. Grow Your Business.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete client management system for garden professionals, freelancers, and small businesses
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="garden" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = '/dashboard'}
            >
              Launch CRM
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-garden">
            <img src={heroImage} alt="Beautiful garden illustration showing various plants and gardening tools" className="w-full h-64 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <div key={index} className="bg-card rounded-xl p-6 shadow-card hover:shadow-garden transition-all duration-300 hover:transform hover:scale-105 animate-grow" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>;
        })}
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            The business management tool garden professionals need
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Built for solo gardeners, freelancers, and small garden businesses. Manage clients, 
            track zones, schedule tasks, and document progress. Say goodbye to messy spreadsheets 
            and missed appointments. Focus on growing great gardens while we handle the business side.
          </p>
          <Button 
            variant="earth" 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/dashboard'}
          >
            Try CRM Free
          </Button>
        </div>
      </div>
    </div>;
};
export default Hero;