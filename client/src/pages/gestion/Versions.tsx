import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Palette,
  Sparkles,
  Focus,
  Check,
  Zap,
  Sun,
  Ghost,
  Gift,
  Laugh,
} from "lucide-react";
import useVersions from "@/hooks/useVersions";
import {
  ShopMode,
  ThemeDecoration,
} from "/Users/etiennepogoda/Downloads/FocusLightCommerce/shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Versions() {
  const { toast } = useToast();
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const {
    activeVersion,
    allVersions,
    isLoading,
    isUpdating,
    setShopMode,
    setThemeDecoration,
    createVersion,
    activateVersion,
    currentVersion,
    setCurrentVersion,
  } = useVersions();

  // État local pour le formulaire de nouvelle version
  const [newVersion, setNewVersion] = useState<{
    shopMode: ShopMode;
    themeDecoration: ThemeDecoration;
    isActive: boolean;
  }>({
    shopMode: "focus",
    themeDecoration: "none",
    isActive: true,
  });

  const handleCreateVersion = () => {
    createVersion(newVersion);
    setShowAddVersionDialog(false);
    toast({
      title: "Version créée",
      description: "La nouvelle version a été créée avec succès",
    });
  };

  const handleActivateVersion = (id: number) => {
    activateVersion(id);
    toast({
      title: "Version activée",
      description: "La version a été activée avec succès",
    });
  };

  const handleShopModeChange = (mode: ShopMode) => {
    setShopMode(mode);
    toast({
      title: "Mode boutique mis à jour",
      description: `Le mode boutique est maintenant en mode ${
        mode === "focus" ? "focus" : "général"
      }`,
    });
  };

  const handleThemeDecorationChange = (decoration: ThemeDecoration) => {
    setThemeDecoration(decoration);
    toast({
      title: "Décoration thématique mise à jour",
      description: "La décoration thématique a été mise à jour avec succès",
    });
  };

  // Fonctions d'aide pour afficher les informations
  const getDecorationLabel = (decoration: ThemeDecoration) => {
    switch (decoration) {
      case "summer-sale":
        return "Soldes d'été";
      case "halloween":
        return "Halloween";
      case "christmas":
        return "Noël";
      case "april-fools":
        return "Poisson d'avril";
      default:
        return "Aucune";
    }
  };

  const getDecorationIcon = (decoration: ThemeDecoration) => {
    switch (decoration) {
      case "summer-sale":
        return <Sun className="h-4 w-4" />;
      case "halloween":
        return <Ghost className="h-4 w-4" />;
      case "christmas":
        return <Gift className="h-4 w-4" />;
      case "april-fools":
        return <Laugh className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout title="Versions du site">
      <div className="grid gap-6">
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Configuration actuelle</TabsTrigger>
            <TabsTrigger value="all">Historique des versions</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mode boutique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Focus className="h-5 w-5" />
                    Mode boutique
                  </CardTitle>
                  <CardDescription>
                    Choisissez entre le mode général ou focus pour votre
                    boutique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    defaultValue={activeVersion?.shopMode || "focus"}
                    onValueChange={(value) =>
                      handleShopModeChange(value as ShopMode)
                    }
                    className="flex flex-col space-y-3"
                    disabled={isLoading || isUpdating}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="focus" id="focus" />
                      <Label htmlFor="focus" className="font-medium">
                        Mode Focus
                      </Label>
                      <p className="text-sm text-muted-foreground ml-6">
                        Axé sur un seul produit, interface minimaliste
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="font-medium">
                        Mode Général
                      </Label>
                      <p className="text-sm text-muted-foreground ml-6">
                        Présentation catalogue avec multiples produits
                      </p>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Décorations thématiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Décorations thématiques
                  </CardTitle>
                  <CardDescription>
                    Activez des décorations saisonnières pour votre boutique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    defaultValue={activeVersion?.themeDecoration || "none"}
                    onValueChange={(value) =>
                      handleThemeDecorationChange(value as ThemeDecoration)
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    disabled={isLoading || isUpdating}
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                      <RadioGroupItem value="none" id="none" />
                      <Label
                        htmlFor="none"
                        className="font-medium flex items-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" /> Aucune
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                      <RadioGroupItem value="summer-sale" id="summer-sale" />
                      <Label
                        htmlFor="summer-sale"
                        className="font-medium flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" /> Soldes d'été
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                      <RadioGroupItem value="halloween" id="halloween" />
                      <Label
                        htmlFor="halloween"
                        className="font-medium flex items-center gap-2"
                      >
                        <Ghost className="h-4 w-4" /> Halloween
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                      <RadioGroupItem value="christmas" id="christmas" />
                      <Label
                        htmlFor="christmas"
                        className="font-medium flex items-center gap-2"
                      >
                        <Gift className="h-4 w-4" /> Noël
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md border">
                      <RadioGroupItem value="april-fools" id="april-fools" />
                      <Label
                        htmlFor="april-fools"
                        className="font-medium flex items-center gap-2"
                      >
                        <Laugh className="h-4 w-4" /> Poisson d'avril
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Historique des versions</CardTitle>
                  <CardDescription>
                    Gérez les différentes versions du site
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddVersionDialog(true)}>
                  Nouvelle version
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Décoration</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isLoading &&
                        allVersions &&
                        allVersions.map((version) => (
                          <TableRow key={version.id}>
                            <TableCell>{version.id}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  version.shopMode === "focus"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {version.shopMode === "focus"
                                  ? "Focus"
                                  : "Général"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getDecorationIcon(version.themeDecoration)}
                                {getDecorationLabel(version.themeDecoration)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(version.createdAt),
                                "dd MMM yyyy à HH:mm",
                                { locale: fr }
                              )}
                            </TableCell>
                            <TableCell>
                              {version.isActive ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-500 text-white"
                                >
                                  Actif
                                </Badge>
                              ) : (
                                <Badge variant="outline">Inactif</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {!version.isActive && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleActivateVersion(version.id)
                                  }
                                  disabled={isUpdating}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Activer
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      {isLoading && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      )}
                      {!isLoading &&
                        (!allVersions || allVersions.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Aucune version trouvée
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogue pour ajouter une nouvelle version */}
      <Dialog
        open={showAddVersionDialog}
        onOpenChange={setShowAddVersionDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle version</DialogTitle>
            <DialogDescription>
              Définissez les paramètres pour cette nouvelle version du site
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-shop-mode">Mode boutique</Label>
              <RadioGroup
                id="new-shop-mode"
                value={newVersion.shopMode}
                onValueChange={(value) =>
                  setNewVersion({ ...newVersion, shopMode: value as ShopMode })
                }
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="focus" id="new-focus" />
                  <Label htmlFor="new-focus">Mode Focus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="new-general" />
                  <Label htmlFor="new-general">Mode Général</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-decoration">Décoration thématique</Label>
              <RadioGroup
                id="new-decoration"
                value={newVersion.themeDecoration}
                onValueChange={(value) =>
                  setNewVersion({
                    ...newVersion,
                    themeDecoration: value as ThemeDecoration,
                  })
                }
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <RadioGroupItem value="none" id="new-none" />
                  <Label htmlFor="new-none" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> Aucune
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <RadioGroupItem value="summer-sale" id="new-summer" />
                  <Label
                    htmlFor="new-summer"
                    className="flex items-center gap-1"
                  >
                    <Sun className="h-4 w-4" /> Soldes d'été
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <RadioGroupItem value="halloween" id="new-halloween" />
                  <Label
                    htmlFor="new-halloween"
                    className="flex items-center gap-1"
                  >
                    <Ghost className="h-4 w-4" /> Halloween
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <RadioGroupItem value="christmas" id="new-christmas" />
                  <Label
                    htmlFor="new-christmas"
                    className="flex items-center gap-1"
                  >
                    <Gift className="h-4 w-4" /> Noël
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <RadioGroupItem value="april-fools" id="new-april" />
                  <Label
                    htmlFor="new-april"
                    className="flex items-center gap-1"
                  >
                    <Laugh className="h-4 w-4" /> Poisson d'avril
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newVersion.isActive}
                onCheckedChange={(checked) =>
                  setNewVersion({ ...newVersion, isActive: checked })
                }
              />
              <Label htmlFor="active">
                Activer immédiatement cette version
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVersionDialog(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleCreateVersion} disabled={isUpdating}>
              <Zap className="h-4 w-4 mr-2" /> Créer la version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
