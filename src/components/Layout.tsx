import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
                src="/growloop-logo.png" 
                alt="GrowLoop" 
                className="w-8 h-8 rounded-lg object-contain"
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