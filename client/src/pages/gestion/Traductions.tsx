import DashboardLayout from "./DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  Search,
  Plus,
  Edit,
  Trash2,
  Languages,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Translation {
  key: string;
  fr: string;
  en: string;
}

interface TranslationEntry {
  key: string;
  value: string;
  language: "fr" | "en";
}

export default function Traductions() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("editor");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "fr" | "en">(
    "all"
  );
  const [editingTranslation, setEditingTranslation] =
    useState<Translation | null>(null);
  const [newTranslation, setNewTranslation] = useState({
    key: "",
    valueFr: "",
    valueEn: "",
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<TranslationEntry[]>([]);

  // Récupérer toutes les traductions
  const { data: allTranslations, isLoading } = useQuery({
    queryKey: ["/api/translations"],
  });

  // Mutation pour mettre à jour une traduction
  const updateSingleMutation = useMutation({
    mutationFn: async (data: TranslationEntry) => {
      return apiRequest("PUT", "/api/translations/single", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      // Émettre un événement pour notifier les autres parties de l'app
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({
        title: "Succès",
        description: "Traduction mise à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la traduction",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour plusieurs traductions
  const updateBulkMutation = useMutation({
    mutationFn: async (translations: TranslationEntry[]) => {
      return apiRequest("PUT", "/api/translations/bulk", { translations });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      setPendingChanges([]);
      // Émettre un événement pour notifier les autres parties de l'app
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({
        title: "Succès",
        description: "Traductions mises à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des traductions",
        variant: "destructive",
      });
    },
  });

  // Mutation pour ajouter une traduction
  const addMutation = useMutation({
    mutationFn: async (data: {
      key: string;
      valueFr: string;
      valueEn: string;
    }) => {
      return apiRequest("POST", "/api/translations/add", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      setNewTranslation({ key: "", valueFr: "", valueEn: "" });
      setShowAddDialog(false);
      // Émettre un événement pour notifier les autres parties de l'app
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({
        title: "Succès",
        description: "Nouvelle traduction ajoutée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description:
          error?.response?.data?.error ||
          "Erreur lors de l'ajout de la traduction",
        variant: "destructive",
      });
    },
  });

  // Mutation pour supprimer une traduction
  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      return apiRequest(
        "DELETE",
        `/api/translations/${encodeURIComponent(key)}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      setDeleteKey(null);
      // Émettre un événement pour notifier les autres parties de l'app
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({
        title: "Succès",
        description: "Traduction supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la traduction",
        variant: "destructive",
      });
    },
  });

  // Transformer les données pour l'affichage
  const getTranslationsArray = (): Translation[] => {
    if (!allTranslations) return [];

    const { fr = {}, en = {} } = allTranslations as {
      fr?: Record<string, string>;
      en?: Record<string, string>;
    };
    const allKeys = new Set([...Object.keys(fr), ...Object.keys(en)]);

    return Array.from(allKeys).map((key) => ({
      key,
      fr: fr[key] || "",
      en: en[key] || "",
    }));
  };

  // Filtrer les traductions selon la recherche et la langue
  const filteredTranslations = getTranslationsArray().filter((translation) => {
    const matchesSearch =
      searchQuery === "" ||
      translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.en.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "all" ||
      (selectedLanguage === "fr" && translation.fr) ||
      (selectedLanguage === "en" && translation.en);

    return matchesSearch && matchesLanguage;
  });

  // Gérer les changements en attente
  const handleTranslationChange = (
    key: string,
    language: "fr" | "en",
    value: string
  ) => {
    setPendingChanges((prev) => {
      const existing = prev.find(
        (change) => change.key === key && change.language === language
      );

      if (existing) {
        return prev.map((change) =>
          change.key === key && change.language === language
            ? { ...change, value }
            : change
        );
      } else {
        return [...prev, { key, language, value }];
      }
    });
  };

  // Obtenir la valeur actuelle d'une traduction (avec changements en attente)
  const getCurrentValue = (key: string, language: "fr" | "en"): string => {
    const pendingChange = pendingChanges.find(
      (change) => change.key === key && change.language === language
    );
    if (pendingChange) {
      return pendingChange.value;
    }

    const translation = getTranslationsArray().find((t) => t.key === key);
    return translation ? translation[language] : "";
  };

  // Vérifier si une traduction a des changements en attente
  const hasPendingChanges = (key: string): boolean => {
    return pendingChanges.some((change) => change.key === key);
  };

  const handleSavePendingChanges = () => {
    if (pendingChanges.length > 0) {
      updateBulkMutation.mutate(pendingChanges);
    }
  };

  const handleCancelPendingChanges = () => {
    setPendingChanges([]);
  };

  const handleEditTranslation = (translation: Translation) => {
    setEditingTranslation(translation);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingTranslation) return;

    const changes: TranslationEntry[] = [];

    if (
      editingTranslation.fr !==
      getTranslationsArray().find((t) => t.key === editingTranslation.key)?.fr
    ) {
      changes.push({
        key: editingTranslation.key,
        language: "fr",
        value: editingTranslation.fr,
      });
    }

    if (
      editingTranslation.en !==
      getTranslationsArray().find((t) => t.key === editingTranslation.key)?.en
    ) {
      changes.push({
        key: editingTranslation.key,
        language: "en",
        value: editingTranslation.en,
      });
    }

    if (changes.length > 0) {
      updateBulkMutation.mutate(changes);
    }

    setShowEditDialog(false);
    setEditingTranslation(null);
  };

  return (
    <DashboardLayout title="Gestion des Traductions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion des Traductions</h1>
            <p className="text-muted-foreground">
              Gérez les traductions de votre site en français et en anglais
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingChanges.length > 0 && (
              <>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  {pendingChanges.length} changement
                  {pendingChanges.length > 1 ? "s" : ""} en attente
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelPendingChanges}
                  disabled={updateBulkMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSavePendingChanges}
                  disabled={updateBulkMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer tout
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="management">Gestion</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {/* Barre de recherche et filtres */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Rechercher une clé ou une traduction..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        selectedLanguage === "all" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedLanguage("all")}
                    >
                      Toutes
                    </Button>
                    <Button
                      variant={
                        selectedLanguage === "fr" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedLanguage("fr")}
                    >
                      🇫🇷 Français
                    </Button>
                    <Button
                      variant={
                        selectedLanguage === "en" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedLanguage("en")}
                    >
                      🇬🇧 Anglais
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table des traductions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Traductions ({filteredTranslations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTranslations.map((translation) => (
                      <div
                        key={translation.key}
                        className={`grid grid-cols-12 gap-4 p-4 border rounded-lg ${
                          hasPendingChanges(translation.key)
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50"
                        }`}
                      >
                        {/* Clé */}
                        <div className="col-span-3">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Clé
                          </div>
                          <div className="text-sm font-mono break-all">
                            {translation.key}
                          </div>
                        </div>

                        {/* Français */}
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            🇫🇷 Français
                          </div>
                          <Textarea
                            value={getCurrentValue(translation.key, "fr")}
                            onChange={(e) =>
                              handleTranslationChange(
                                translation.key,
                                "fr",
                                e.target.value
                              )
                            }
                            className="min-h-[60px] text-sm"
                            placeholder="Traduction française..."
                          />
                        </div>

                        {/* Anglais */}
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            🇬🇧 Anglais
                          </div>
                          <Textarea
                            value={getCurrentValue(translation.key, "en")}
                            onChange={(e) =>
                              handleTranslationChange(
                                translation.key,
                                "en",
                                e.target.value
                              )
                            }
                            className="min-h-[60px] text-sm"
                            placeholder="English translation..."
                          />
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex flex-col justify-center gap-2">
                          {hasPendingChanges(translation.key) && (
                            <Badge variant="secondary" className="text-xs">
                              Modifié
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTranslation(translation)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Actions de gestion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle traduction
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter (bientôt)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer (bientôt)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {getTranslationsArray().length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Clés totales
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {
                        getTranslationsArray().filter((t) => t.fr && t.en)
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Complètes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {
                        getTranslationsArray().filter((t) => !t.fr || !t.en)
                          .length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Incomplètes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {pendingChanges.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      En attente
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table de gestion détaillée */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clé</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Français</TableHead>
                      <TableHead>Anglais</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTranslations.slice(0, 50).map((translation) => (
                      <TableRow key={translation.key}>
                        <TableCell className="font-mono text-sm">
                          {translation.key}
                        </TableCell>
                        <TableCell>
                          {translation.fr && translation.en ? (
                            <Badge variant="default">
                              <Check className="h-3 w-3 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <X className="h-3 w-3 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {translation.fr || (
                            <span className="text-muted-foreground">Vide</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {translation.en || (
                            <span className="text-muted-foreground">Vide</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTranslation(translation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteKey(translation.key)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog pour ajouter une nouvelle traduction */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle traduction</DialogTitle>
            <DialogDescription>
              Créez une nouvelle clé de traduction avec ses valeurs en français
              et en anglais.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Clé</label>
              <Input
                value={newTranslation.key}
                onChange={(e) =>
                  setNewTranslation((prev) => ({
                    ...prev,
                    key: e.target.value,
                  }))
                }
                placeholder="ex: nav.home"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Français</label>
              <Textarea
                value={newTranslation.valueFr}
                onChange={(e) =>
                  setNewTranslation((prev) => ({
                    ...prev,
                    valueFr: e.target.value,
                  }))
                }
                placeholder="Traduction en français"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Anglais</label>
              <Textarea
                value={newTranslation.valueEn}
                onChange={(e) =>
                  setNewTranslation((prev) => ({
                    ...prev,
                    valueEn: e.target.value,
                  }))
                }
                placeholder="English translation"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => addMutation.mutate(newTranslation)}
              disabled={!newTranslation.key || addMutation.isPending}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer une traduction */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la traduction</DialogTitle>
            <DialogDescription>
              Modifiez les valeurs de cette traduction.
            </DialogDescription>
          </DialogHeader>
          {editingTranslation && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Clé</label>
                <Input
                  value={editingTranslation.key}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Français</label>
                <Textarea
                  value={editingTranslation.fr}
                  onChange={(e) =>
                    setEditingTranslation((prev) =>
                      prev ? { ...prev, fr: e.target.value } : null
                    )
                  }
                  placeholder="Traduction en français"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Anglais</label>
                <Textarea
                  value={editingTranslation.en}
                  onChange={(e) =>
                    setEditingTranslation((prev) =>
                      prev ? { ...prev, en: e.target.value } : null
                    )
                  }
                  placeholder="English translation"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateBulkMutation.isPending}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteKey} onOpenChange={() => setDeleteKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la traduction</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la clé "{deleteKey}" ? Cette
              action supprimera la traduction dans toutes les langues et ne peut
              pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteKey && deleteMutation.mutate(deleteKey)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
