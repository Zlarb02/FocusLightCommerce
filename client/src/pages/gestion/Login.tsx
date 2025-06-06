import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function GestionLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Réinitialiser le drapeau de vérification d'authentification quand on arrive sur la page de login
  useEffect(() => {
    // Réinitialiser le marqueur d'auth pour éviter les messages répétés
    sessionStorage.removeItem("auth_checked");
  }, []);

  // Vérifier le statut d'authentification
  const { data: authStatus } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/status");
        return response;
      } catch (error) {
        return { authenticated: false };
      }
    },
  });

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (authStatus?.authenticated && authStatus?.user?.isAdmin) {
      setLocation("/gestion/dashboard");
    }
  }, [authStatus, setLocation]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);

      if (response?.id) {
        // Invalider le cache de la requête d'authentification
        // en utilisant exactement la même clé que dans AuthGuard
        queryClient.invalidateQueries({ queryKey: ["authStatus"] });

        // Signaler explicitement qu'une connexion vient de réussir
        // pour bloquer tout toast d'erreur d'AuthGuard
        sessionStorage.setItem("login_success", "true");

        // Verrouiller temporairement les toasts d'authentification
        // Ce verrou sera utilisé par AuthGuard pour ne pas afficher
        // de messages pendant quelques secondes
        sessionStorage.setItem("auth_toast_lock", Date.now().toString());

        // Afficher le toast de succès immédiatement
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace de gestion",
          variant: "success", // Toast vert pour succès
        });

        // Rediriger immédiatement
        setLocation("/gestion/dashboard");
      } else {
        throw new Error("La connexion a échoué");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description:
          "Les identifiants sont incorrects ou un problème est survenu",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant la vérification
  if (authStatus?.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl mb-2">Alto</h1>
          <p className="text-muted-foreground">Espace de gestion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour gérer vos stocks et commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre identifiant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mot de passe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => setLocation("/shop")}>
            Retourner au site
          </Button>
        </div>
      </div>
    </div>
  );
}
