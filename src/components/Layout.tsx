import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card flex items-center px-6 sticky top-0 z-10">
            <SidebarTrigger>
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/fb881d8d-d8ba-4f97-b3a8-afcaff7e1063.png" 
                alt="GrowLoop logo - garden CRM" 
                className="w-8 h-8 rounded-lg object-contain"
                loading="lazy"
              />
              <h1 className="text-lg font-serif font-semibold text-foreground">
                GrowLoop CRM
              </h1>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}