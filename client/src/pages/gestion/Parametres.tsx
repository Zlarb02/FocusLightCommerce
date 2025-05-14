import DashboardLayout from "./DashboardLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Lock,
  Save,
  Settings,
  CreditCard,
  Mail,
  Building,
  Globe,
  User,
} from "lucide-react";

// Ajout d'un paramètre pour le mode boutique (généraliste ou focus)
const shopModeKey = "shopMode";

function getShopMode(): "general" | "focus" {
  if (typeof window !== "undefined") {
    return (
      (localStorage.getItem(shopModeKey) as "general" | "focus") || "general"
    );
  }
  return "general";
}

function setShopMode(mode: "general" | "focus") {
  if (typeof window !== "undefined") {
    localStorage.setItem(shopModeKey, mode);
  }
}

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Le nom du site est requis"),
  siteDescription: z.string().min(1, "La description est requise"),
  contactEmail: z.string().email("L'email n'est pas valide"),
  contactPhone: z.string().min(1, "Le numéro de téléphone est requis"),
});

const paymentSettingsSchema = z.object({
  currencyCode: z.string().min(1, "La devise est requise"),
  stripePublicKey: z.string().min(1, "La clé publique Stripe est requise"),
  stripeSecretKey: z.string().min(1, "La clé secrète Stripe est requise"),
  enablePaypal: z.boolean(),
  paypalClientId: z.string().optional(),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, "Le serveur SMTP est requis"),
  smtpPort: z.coerce.number().int().min(1, "Le port SMTP est requis"),
  smtpUsername: z.string().min(1, "Le nom d'utilisateur SMTP est requis"),
  smtpPassword: z.string().min(1, "Le mot de passe SMTP est requis"),
  senderEmail: z.string().email("L'email de l'expéditeur n'est pas valide"),
  senderName: z.string().min(1, "Le nom de l'expéditeur est requis"),
});

const userAccountSchema = z
  .object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
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

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type PaymentSettingsFormValues = z.infer<typeof paymentSettingsSchema>;
type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;
type UserAccountFormValues = z.infer<typeof userAccountSchema>;

export default function Parametres() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("general");

  const generalSettingsForm = useForm<
    GeneralSettingsFormValues & { shopMode: "general" | "focus" }
  >({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "Alto Lille",
      siteDescription:
        "Lampes d'appoint FOCUS.01 éco-responsables aux lignes épurées",
      contactEmail: "altolille@gmail.com",
      contactPhone: "+33 782 086 690",
      shopMode: getShopMode(),
    },
  });

  const paymentSettingsForm = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      currencyCode: "EUR",
      stripePublicKey: "pk_test_sample_key",
      stripeSecretKey: "sk_test_sample_key",
      enablePaypal: false,
      paypalClientId: "",
    },
  });

  const emailSettingsForm = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.example.com",
      smtpPort: 587,
      smtpUsername: "altolille@gmail.com",
      smtpPassword: "password123",
      senderEmail: "altolille@gmail.com",
      senderName: "Alto Lille",
    },
  });

  const userAccountForm = useForm<UserAccountFormValues>({
    resolver: zodResolver(userAccountSchema),
    defaultValues: {
      username: "gestionnaire",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitGeneralSettings = (data: GeneralSettingsFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Paramètres généraux mis à jour",
      description: "Les paramètres généraux ont été mis à jour avec succès.",
    });
  };

  const onSubmitPaymentSettings = (data: PaymentSettingsFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Paramètres de paiement mis à jour",
      description: "Les paramètres de paiement ont été mis à jour avec succès.",
    });
  };

  const onSubmitEmailSettings = (data: EmailSettingsFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Paramètres d'email mis à jour",
      description: "Les paramètres d'email ont été mis à jour avec succès.",
    });
  };

  const onSubmitUserAccount = (data: UserAccountFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Compte utilisateur mis à jour",
      description: "Votre mot de passe a été mis à jour avec succès.",
    });

    userAccountForm.reset({
      ...data,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <DashboardLayout title="Paramètres">
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" /> Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configurez les informations générales de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalSettingsForm}>
                <form
                  onSubmit={generalSettingsForm.handleSubmit(
                    onSubmitGeneralSettings
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={generalSettingsForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du site</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalSettingsForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description du site</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalSettingsForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalSettingsForm.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalSettingsForm.control}
                    name="shopMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4 mb-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mode de la boutique
                          </FormLabel>
                          <FormDescription>
                            Permutez entre la boutique généraliste (tous
                            produits) et la boutique Focus (lampes Focus.01
                            uniquement).
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "focus"}
                            onCheckedChange={(checked) => {
                              const mode = checked ? "focus" : "general";
                              field.onChange(mode);
                              setShopMode(mode);
                            }}
                            id="shop-mode-switch"
                          />
                        </FormControl>
                        <span className="ml-4 font-semibold">
                          {field.value === "focus"
                            ? "Boutique Focus"
                            : "Boutique Généraliste"}
                        </span>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les
                    modifications
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Configuration des paiements
              </CardTitle>
              <CardDescription>
                Gérez les méthodes de paiement et les paramètres associés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentSettingsForm}>
                <form
                  onSubmit={paymentSettingsForm.handleSubmit(
                    onSubmitPaymentSettings
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={paymentSettingsForm.control}
                    name="currencyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devise</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une devise" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="USD">Dollar ($)</SelectItem>
                            <SelectItem value="GBP">
                              Livre Sterling (£)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentSettingsForm.control}
                    name="stripePublicKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé publique Stripe</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentSettingsForm.control}
                    name="stripeSecretKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé secrète Stripe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Cette clé est sensible et ne doit jamais être partagée
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentSettingsForm.control}
                    name="enablePaypal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Activer PayPal
                          </FormLabel>
                          <FormDescription>
                            Permettre aux clients de payer avec PayPal
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {paymentSettingsForm.watch("enablePaypal") && (
                    <FormField
                      control={paymentSettingsForm.control}
                      name="paypalClientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client ID PayPal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les
                    modifications
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Paramètres Email
              </CardTitle>
              <CardDescription>
                Configurez les paramètres d'envoi d'email pour les notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailSettingsForm}>
                <form
                  onSubmit={emailSettingsForm.handleSubmit(
                    onSubmitEmailSettings
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailSettingsForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serveur SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailSettingsForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port SMTP</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d'utilisateur SMTP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe SMTP</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailSettingsForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de l'expéditeur</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailSettingsForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'expéditeur</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les
                    modifications
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Votre compte
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userAccountForm}>
                <form
                  onSubmit={userAccountForm.handleSubmit(onSubmitUserAccount)}
                  className="space-y-4"
                >
                  <FormField
                    control={userAccountForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Le nom d'utilisateur ne peut pas être modifié
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Changer de mot de passe
                    </h3>
                    <FormField
                      control={userAccountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
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
                            <Input type="password" {...field} />
                          </FormControl>
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
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Mettre à jour le mot de
                    passe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
