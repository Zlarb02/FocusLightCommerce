import DashboardLayout from "./DashboardLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock, Save, Server, User } from "lucide-react";
import { apiRequest, getApiBaseUrl } from "@/lib/queryClient";

const userAccountSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit comporter au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type UserAccountFormValues = z.infer<typeof userAccountSchema>;

export default function Parametres() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Utilisateur connecté (même clé de cache que l'AuthGuard)
  const { data: authStatus } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      try {
        return await apiRequest("GET", "/api/auth/status");
      } catch (error) {
        return { authenticated: false };
      }
    },
  });

  const userAccountForm = useForm<UserAccountFormValues>({
    resolver: zodResolver(userAccountSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitUserAccount = async (data: UserAccountFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
        variant: "success",
      });
      userAccountForm.reset();
    } catch (error) {
      const isWrongPassword =
        error instanceof Error && error.message.includes("401");
      toast({
        title: "Erreur",
        description: isWrongPassword
          ? "Le mot de passe actuel est incorrect."
          : "Une erreur est survenue lors de la mise à jour du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stripeKey = window.ENV?.STRIPE_PUBLISHABLE_KEY || "";

  return (
    <DashboardLayout title="Paramètres">
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Votre compte
              </CardTitle>
              <CardDescription>
                Gérez votre mot de passe d'accès à l'espace de gestion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm font-medium mb-1">Nom d'utilisateur</p>
                <Input
                  value={authStatus?.user?.username || ""}
                  disabled
                  autoComplete="username"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Le nom d'utilisateur ne peut pas être modifié
                </p>
              </div>

              <Form {...userAccountForm}>
                <form
                  onSubmit={userAccountForm.handleSubmit(onSubmitUserAccount)}
                  className="space-y-4"
                >
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Changer de mot de passe
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={userAccountForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                autoComplete="current-password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userAccountForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                autoComplete="new-password"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Au moins 6 caractères
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userAccountForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                autoComplete="new-password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting
                      ? "Mise à jour..."
                      : "Mettre à jour le mot de passe"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" /> Configuration du site
              </CardTitle>
              <CardDescription>
                Configuration effective, en lecture seule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                  <span className="text-muted-foreground">Environnement</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded w-fit">
                    {window.ENV?.NODE_ENV || "development"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                  <span className="text-muted-foreground">URL de l'API</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded w-fit text-xs">
                    {getApiBaseUrl()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                  <span className="text-muted-foreground">
                    Clé publique Stripe
                  </span>
                  <span className="font-mono bg-muted px-2 py-1 rounded w-fit text-xs">
                    {stripeKey
                      ? `${stripeKey.substring(0, 14)}…`
                      : "Non configurée"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                  <span className="text-muted-foreground">Mode Stripe</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded w-fit">
                    {stripeKey.startsWith("pk_live")
                      ? "production"
                      : stripeKey.startsWith("pk_test")
                      ? "test"
                      : "inconnu"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2">
                  <span className="text-muted-foreground">Devise</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded w-fit">
                    EUR
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Les paramètres sensibles (clé secrète Stripe, serveur SMTP,
                  identifiants d'envoi d'email) sont configurés côté serveur
                  via les variables d'environnement, et ne sont pas modifiables
                  depuis cette interface. Contactez votre développeur pour les
                  faire évoluer.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
