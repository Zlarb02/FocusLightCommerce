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
    if (!isLoading && (!data?.authenticated || !data?.user?.isAdmin)) {
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive",
      });
      setLocation("/gestion");
    }
  }, [data, isLoading, setLocation, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return data?.authenticated && data?.user?.isAdmin ? children : null;
}
