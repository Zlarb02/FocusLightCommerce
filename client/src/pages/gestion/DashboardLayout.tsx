import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Icônes de lucide-react (Assurez-vous que le package est installé)
import {
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Vérification d'authentification simple (à remplacer par votre logique d'authentification)
  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem("gestion_authenticated") === "true";
    if (!isAuthenticated) {
      toast({
        title: "Accès non autorisé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive",
      });
      setLocation("/gestion");
    }
  }, [setLocation, toast]);

  const handleLogout = () => {
    localStorage.removeItem("gestion_authenticated");
    toast({
      title: "Déconnexion réussie",
    });
    setLocation("/gestion");
  };

  const menuItems = [
    { name: "Tableau de bord", href: "/gestion/dashboard", icon: Home },
    { name: "Stocks", href: "/gestion/stocks", icon: Package },
    { name: "Commandes", href: "/gestion/commandes", icon: ShoppingCart },
    { name: "Contenu du site", href: "/gestion/contenu", icon: FileText },
    { name: "Paramètres", href: "/gestion/parametres", icon: Settings },
  ];

  return (
    <>
      {/* Menu latéral version desktop */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 border-r bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b h-16">
            <h2 className="text-lg font-medium">Alto Gestion</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => setLocation(item.href)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                );
              })}

              <div className="pt-4 mt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Déconnexion
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </aside>

      {/* Header mobile avec menu hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b px-4 h-16 flex items-center justify-between">
        <h2 className="text-lg font-medium">Alto Gestion</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <h2 className="text-lg font-medium">FOCUS Gestion</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-full py-4 px-2">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setLocation(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Button>
                  );
                })}

                <div className="pt-4 mt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="md:ml-64 flex-1 overflow-auto">
        <div className="py-6 md:py-8 px-4 md:px-8 mt-16 md:mt-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </>
  );
}
