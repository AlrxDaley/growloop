import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Leaf, 
  TreePine, 
  Check, 
  Star,
  BookOpen,
  Palette,
  Camera,
  Flower
} from "lucide-react";
import { useState } from "react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Sprout",
      icon: <Sprout className="w-8 h-8 text-success" />,
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for beginners starting their garden journey",
      features: [
        "Track up to 10 plants",
        "2 active garden zones",
        "Add notes and upload photos",
        "Manual reminders",
        "Planting calendar based on region",
        "Export to CSV",
        "Access on web and mobile",
        "No ads, no spam"
      ],
      cta: "Start Free",
      popular: false,
      variant: "outline" as const
    },
    {
      name: "Grower",
      icon: <Leaf className="w-8 h-8 text-primary" />,
      price: { monthly: 7, yearly: 70 },
      description: "For active gardeners ready to expand their growing",
      features: [
        "Everything in Sprout, plus:",
        "Unlimited plants and zones",
        "Smart reminders (watering, feeding, pruning)",
        "Plant library for reusing past entries",
        "Printable layouts",
        "Zone templates (e.g., 4x4 veggie patch)",
        "Multiple gardens (e.g., home + allotment)"
      ],
      cta: "Start Free Trial",
      popular: true,
      variant: "garden" as const
    },
    {
      name: "Master Gardener",
      icon: <TreePine className="w-8 h-8 text-warning" />,
      price: { monthly: 15, yearly: 120 },
      description: "Advanced tools for serious hobby gardeners",
      features: [
        "Everything in Grower, plus:",
        "AI-powered plant health scan",
        "PlantPal Assistant chatbot",
        "Garden analytics (yield history, success rates)",
        "Offline mode",
        "Microclimate tracking per zone",
        "Community-sourced disease/pest alerts",
        "End-of-season PDF summary report"
      ],
      cta: "Start Free Trial",
      popular: false,
      variant: "earth" as const
    }
  ];

  const addOns = [
    {
      name: "PDF Journal Export",
      price: 5,
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      description: "Beautiful printable garden journal"
    },
    {
      name: "Starter Patch Templates",
      price: "7-15",
      icon: <Palette className="w-6 h-6 text-primary" />,
      description: "Pre-designed garden plans"
    },
    {
      name: "Seed Scanner Pack",
      price: 3.99,
      icon: <Camera className="w-6 h-6 text-primary" />,
      description: "Auto-detect seed varieties via photo"
    },
    {
      name: "Moodboard Planner",
      price: 2.99,
      icon: <Flower className="w-6 h-6 text-primary" />,
      description: "Visual drag-and-drop planning space"
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to your paid features until the end of your billing period."
    },
    {
      question: "What happens to my data if I downgrade?",
      answer: "Your plant data is always safe. If you downgrade, you'll simply lose access to premium features, but all your plants and notes remain accessible."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes! Both Grower and Master Gardener plans come with a 30-day free trial. No credit card required to start."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not happy, we'll refund your purchase."
    },
    {
      question: "Can I switch between monthly and yearly billing?",
      answer: "Absolutely! You can change your billing frequency anytime from your account settings. Yearly plans save you money with a 17% discount."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Choose Your Growing Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Start free and grow with CropTrackr. From first seedling to master harvest, 
            we have the right tools for your gardening journey.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary shadow-glow' : ''} hover:shadow-card transition-all duration-300`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="pt-4">
                    <div className="text-4xl font-bold text-foreground">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                      {plan.price.monthly > 0 && (
                        <span className="text-lg text-muted-foreground font-normal">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {plan.price.monthly > 0 && isYearly && (
                      <div className="text-sm text-muted-foreground">
                        ${(plan.price.yearly / 12).toFixed(2)}/month billed yearly
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className={`text-sm ${feature.includes('Everything in') ? 'font-medium text-muted-foreground' : ''}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6">
                    <Button variant={plan.variant} className="w-full">
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Optional Add-ons
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your gardening experience with these specialized tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={addon.name} className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {addon.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{addon.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                  <div className="text-xl font-bold text-primary">
                    ${addon.price}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about CropTrackr pricing
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Ready to Grow Better?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of gardeners already growing smarter with CropTrackr
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Start Free Today
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;