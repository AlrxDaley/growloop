import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SproutlyChat from "@/components/SproutlyChat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <SproutlyChat />
    </div>
  );
};

export default Index;
