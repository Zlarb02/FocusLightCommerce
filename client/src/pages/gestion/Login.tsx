import { useState } from "react";
import { useLocation } from "wouter";
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
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function GestionLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      // Dans un environnement réel, vous devriez appeler votre API ici
      // Simulation d'une connexion réussie pour la démonstration
      if (data.username === "gestionnaire" && data.password === "focus2024") {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace de gestion",
        });

        // Simuler la création d'une session (à remplacer par votre logique d'authentification)
        localStorage.setItem("gestion_authenticated", "true");

        setLocation("/gestion/dashboard");
      } else {
        throw new Error("Identifiants incorrects");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl mb-2">FOCUS</h1>
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
          <CardFooter className="flex justify-center border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Pour l'accès démo, utilisez{" "}
              <span className="font-medium">gestionnaire</span> /{" "}
              <span className="font-medium">focus2024</span>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => setLocation("/")}>
            Retourner au site
          </Button>
        </div>
      </div>
    </div>
  );
}
