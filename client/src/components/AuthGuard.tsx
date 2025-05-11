import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/status");
        return response;
      } catch (error) {
        return { authenticated: false };
      }
    },
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (isLoading) return;

    // Vérifier si un verrou temporaire est actif pour les toasts d'authentification
    const lockTimestamp = sessionStorage.getItem("auth_toast_lock");
    if (lockTimestamp) {
      const lockTime = parseInt(lockTimestamp, 10);
      const now = Date.now();
      // Si le verrou a moins de 3 secondes, ne pas afficher de toast
      if (now - lockTime < 3000) {
        return;
      } else {
        // Nettoyer le verrou s'il est périmé
        sessionStorage.removeItem("auth_toast_lock");
      }
    }

    // Si l'utilisateur vient de se connecter avec succès,
    // ne pas interférer avec la redirection et toast de la page de login
    if (sessionStorage.getItem("login_success")) {
      sessionStorage.removeItem("login_success");
      return;
    }

    // L'utilisateur est connecté et admin
    if (data?.authenticated && data?.user?.isAdmin) {
      // Réinitialiser le marqueur d'auth pour les futures vérifications
      sessionStorage.removeItem("auth_checked");
      return;
    }

    // L'utilisateur n'est pas connecté ou n'est pas admin
    // Vérifier si c'est un accès direct à une page protégée
    const fromDirectAccess = !sessionStorage.getItem("auth_checked");

    if (fromDirectAccess) {
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive",
      });
    }

    // Marquer que la vérification d'auth a été faite
    sessionStorage.setItem("auth_checked", "true");

    // Redirection vers la page de login
    setLocation("/gestion");
  }, [data, isLoading, setLocation, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return data?.authenticated && data?.user?.isAdmin ? children : null;
}
