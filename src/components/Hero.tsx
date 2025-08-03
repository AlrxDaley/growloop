import { Button } from "@/components/ui/button";
import { Sprout, Camera, Brain, Bell } from "lucide-react";
import heroImage from "@/assets/hero-garden.jpg";

const Hero = () => {
  const features = [
    {
      icon: Sprout,
      title: "Zone-Based Tracking",
      description: "Organize your garden into beds and zones for better plant management"
    },
    {
      icon: Camera,
      title: "Plant Journal",
      description: "Log photos, notes, and growth updates for each plant"
    },
    {
      icon: Brain,
      title: "AI Plant Doctor",
      description: "Get instant diagnosis and treatment for plant health issues"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss watering, pruning, or feeding schedules"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 animate-grow">
              CropTrackr
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2 font-light">
              Grow Better. Know Smarter.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your garden's AI companion for tracking plants, diagnosing issues, and growing with confidence
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="garden" size="lg" className="text-lg px-8 py-3">
              Start Growing
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-garden">
            <img 
              src={heroImage} 
              alt="Beautiful garden illustration showing various plants and gardening tools" 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-garden transition-all duration-300 hover:transform hover:scale-105 animate-grow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            The gardening sidekick you've always needed
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Designed for hobby growers who want less guessing and more growing. Track what's planted where, 
            log your plant's journey, and get AI-powered help when things look off. No spreadsheets. 
            No pesticide upsells. Just a smart, friendly companion that grows with you.
          </p>
          <Button variant="earth" size="lg" className="text-lg px-8 py-3">
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;