
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, CalendarDays, ClipboardList, LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Pesquisas",
    href: "/surveys",
    icon: ClipboardList,
  },
  {
    name: "Agendamentos",
    href: "/scheduling",
    icon: CalendarDays,
  },
  {
    name: "Perfil",
    href: "/profile",
    icon: User,
  },
];

export function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container flex justify-between items-center h-16">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="font-display text-xl font-semibold text-primary">
            SensoryNexus
          </Link>

          {!isMobile && (
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        )}
      </div>

      {isMobile && mobileMenuOpen && (
        <nav className="px-4 py-2 pb-4 border-t border-border animate-fade-in">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-md my-1 transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 w-full mt-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </nav>
      )}
    </header>
  );
}
