import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BarChart, BoxesIcon, Home, LogOut, Package, Menu, Users } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Check if user is authenticated
  const { data: authStatus, isLoading } = useQuery({
    queryKey: ["/api/auth/status"],
    onSuccess: (data) => {
      if (!data.authenticated) {
        navigate("/admin/login");
      }
    },
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate("/admin/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white shadow-sm">
        <div className="flex items-center justify-center h-16 bg-primary text-primary-foreground">
          <h1 className="font-heading font-bold text-xl">FOCUS Admin</h1>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <Link href="/admin">
                <a className={`flex items-center px-4 py-3 ${location === "/admin" ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                  <Home className="h-5 w-5 mr-3" />
                  Tableau de bord
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a className={`flex items-center px-4 py-3 ${location === "/admin/orders" ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                  <Package className="h-5 w-5 mr-3" />
                  Commandes
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className={`flex items-center px-4 py-3 ${location === "/admin/products" ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                  <BoxesIcon className="h-5 w-5 mr-3" />
                  Produits
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics">
                <a className={`flex items-center px-4 py-3 ${location === "/admin/analytics" ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                  <BarChart className="h-5 w-5 mr-3" />
                  Analytiques
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
          <Link href="/">
            <a className="mt-2 block text-sm text-center text-muted-foreground hover:underline">
              Retour au site
            </a>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top nav - Mobile */}
        <header className="lg:hidden bg-white shadow-sm flex items-center justify-between h-16 px-4">
          <h1 className="font-heading font-bold text-xl">FOCUS Admin</h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="font-heading font-bold text-xl mb-6">FOCUS Admin</div>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <Link href="/admin">
                      <a className={`flex items-center py-2 ${location === "/admin" ? "text-primary" : "text-gray-700"}`}>
                        <Home className="h-5 w-5 mr-3" />
                        Tableau de bord
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/orders">
                      <a className={`flex items-center py-2 ${location === "/admin/orders" ? "text-primary" : "text-gray-700"}`}>
                        <Package className="h-5 w-5 mr-3" />
                        Commandes
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/products">
                      <a className={`flex items-center py-2 ${location === "/admin/products" ? "text-primary" : "text-gray-700"}`}>
                        <BoxesIcon className="h-5 w-5 mr-3" />
                        Produits
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/analytics">
                      <a className={`flex items-center py-2 ${location === "/admin/analytics" ? "text-primary" : "text-gray-700"}`}>
                        <BarChart className="h-5 w-5 mr-3" />
                        Analytiques
                      </a>
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="absolute bottom-4 left-4 right-4">
                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-3" />
                  Déconnexion
                </Button>
                <Link href="/">
                  <a className="mt-2 block text-sm text-center text-muted-foreground hover:underline">
                    Retour au site
                  </a>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
