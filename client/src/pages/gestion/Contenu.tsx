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
  Edit,
  Languages,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Image,
  FileText,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  useIllustrations,
  useUpdateIllustration,
  type Illustration,
  type IllustrationEntry,
} from "@/hooks/use-illustrations";

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

interface PaginatedResponse {
  translations: Translation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface TranslationStats {
  totalKeys: number;
  frTranslations: number;
  enTranslations: number;
  missingFr: number;
  missingEn: number;
}

interface ImageItem {
  key: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  pages: string[];
}

interface ImageEntry {
  key: string;
  title: string;
  url: string;
  description?: string;
  category: string;
}

export default function Contenu() {
  const { toast } = useToast();
  const [mainTab, setMainTab] = useState("textes");
  const [selectedTab, setSelectedTab] = useState("editor");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "fr" | "en">(
    "all"
  );
  const [editingTranslation, setEditingTranslation] =
    useState<Translation | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<TranslationEntry[]>([]);
  const [rawJsonValue, setRawJsonValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // États pour la gestion des images
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageCurrentPage, setImageCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingImage, setEditingImage] = useState<Illustration | null>(null);
  const [showEditImageDialog, setShowEditImageDialog] = useState(false);
  const [debouncedImageSearch, setDebouncedImageSearch] = useState("");
  
  // États pour le JSON des illustrations
  const [rawIllustrationsJsonValue, setRawIllustrationsJsonValue] = useState("");

  // Hooks pour les illustrations
  const { data: illustrationsData, isLoading: illustrationsLoading } =
    useIllustrations(
      imageCurrentPage,
      12, // Afficher 12 images par page
      debouncedImageSearch,
      selectedCategory === "all" ? "" : selectedCategory
    );

  const updateIllustrationMutation = useUpdateIllustration();

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset à la page 1 lors d'une nouvelle recherche
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce pour la recherche d'images
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedImageSearch(imageSearchQuery);
      setImageCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [imageSearchQuery]);

  // Récupérer les statistiques
  const { data: stats } = useQuery({
    queryKey: ["/api/translations/stats"],
  });

  // Récupérer les traductions paginées
  const { data: paginatedData, isLoading } = useQuery({
    queryKey: ["/api/translations", currentPage, pageSize, debouncedSearch],
    queryFn: async (): Promise<PaginatedResponse> => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: debouncedSearch,
      });

      const response = await fetch(`/api/translations?${params}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des traductions");
      }

      return response.json();
    },
  });

  // Récupérer le JSON complet (pour le mode JSON uniquement)
  const { data: fullTranslations } = useQuery({
    queryKey: ["/api/translations/full"],
    queryFn: async () => {
      const response = await fetch("/api/translations/full");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du JSON complet");
      }
      return response.json();
    },
    enabled: selectedTab === "json", // Ne charger que quand on est sur l'onglet JSON
  });

  // Récupérer le JSON complet des illustrations
  const { data: fullIllustrations } = useQuery({
    queryKey: ["/api/illustrations/public/full"],
    queryFn: async () => {
      const response = await fetch("/api/illustrations/public/full");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du JSON complet des illustrations");
      }
      return response.json();
    },
    enabled: selectedTab === "json-images", // Ne charger que quand on est sur l'onglet JSON images
  });

  // Mutation pour mettre à jour une traduction
  const updateSingleMutation = useMutation({
    mutationFn: async (data: TranslationEntry) => {
      return apiRequest("PUT", "/api/translations/single", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/stats"] });
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

  // Mutation pour mise à jour en lot
  const updateBulkMutation = useMutation({
    mutationFn: async (data: TranslationEntry[]) => {
      return apiRequest("PUT", "/api/translations/bulk", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/stats"] });
      setPendingChanges([]);
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
      queryClient.invalidateQueries({ queryKey: ["/api/translations/stats"] });
      setDeleteKey(null);
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

  // Mutation pour mise à jour complète via JSON
  const updateFullJsonMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/translations/full", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/stats"] });
      window.dispatchEvent(new CustomEvent("translationsUpdated"));
      toast({
        title: "Succès",
        description: "Fichier de traductions mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du fichier de traductions",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour le JSON complet des illustrations
  const updateFullIllustrationsJsonMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/illustrations/full", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/illustrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/illustrations/public/full"] });
      window.dispatchEvent(new CustomEvent("illustrationsUpdated"));
      toast({
        title: "Succès",
        description: "Fichier d'illustrations mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du fichier d'illustrations",
        variant: "destructive",
      });
    },
  });

  // Initialiser le JSON brut quand les données sont chargées
  useEffect(() => {
    if (fullTranslations && selectedTab === "json") {
      setRawJsonValue(JSON.stringify(fullTranslations, null, 2));
    }
  }, [fullTranslations, selectedTab]);

  // Initialiser le JSON des illustrations quand les données sont chargées
  useEffect(() => {
    if (fullIllustrations && selectedTab === "json-images") {
      setRawIllustrationsJsonValue(JSON.stringify(fullIllustrations, null, 2));
    }
  }, [fullIllustrations, selectedTab]);

  // Filtrer les traductions selon la langue sélectionnée
  const filteredTranslations =
    paginatedData?.translations?.filter((translation) => {
      if (selectedLanguage === "all") return true;
      if (selectedLanguage === "fr") return translation.fr;
      if (selectedLanguage === "en") return translation.en;
      return true;
    }) || [];

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

    const translation = filteredTranslations.find((t) => t.key === key);
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

    const originalTranslation = filteredTranslations.find(
      (t) => t.key === editingTranslation.key
    );

    if (
      originalTranslation &&
      editingTranslation.fr !== originalTranslation.fr
    ) {
      changes.push({
        key: editingTranslation.key,
        language: "fr",
        value: editingTranslation.fr,
      });
    }

    if (
      originalTranslation &&
      editingTranslation.en !== originalTranslation.en
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

  const handleEditIllustration = (illustration: Illustration) => {
    setEditingImage(illustration);
    setShowEditImageDialog(true);
  };

  const handleSaveIllustrationEdit = () => {
    if (!editingImage) return;

    updateIllustrationMutation.mutate(editingImage, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Illustration mise à jour avec succès",
        });
        setShowEditImageDialog(false);
        setEditingImage(null);
      },
      onError: (error: any) => {
        toast({
          title: "Erreur",
          description:
            error.message || "Erreur lors de la mise à jour de l'illustration",
          variant: "destructive",
        });
      },
    });
  };

  const handleSaveJsonChanges = () => {
    try {
      const parsedJson = JSON.parse(rawJsonValue);
      updateFullJsonMutation.mutate(parsedJson);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Le JSON n'est pas valide. Veuillez vérifier la syntaxe.",
        variant: "destructive",
      });
    }
  };

  const handleSaveIllustrationsJsonChanges = () => {
    try {
      const parsedJson = JSON.parse(rawIllustrationsJsonValue);
      updateFullIllustrationsJsonMutation.mutate(parsedJson);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Le JSON des illustrations n'est pas valide. Veuillez vérifier la syntaxe.",
        variant: "destructive",
      });
    }
  };

  if (isLoading && !paginatedData) {
    return (
      <DashboardLayout title="Contenu du site">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des traductions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contenu du site">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion du contenu</h1>
            <p className="text-muted-foreground">
              Gérez les textes et images de votre site web
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mainTab === "textes" && pendingChanges.length > 0 && (
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
                  Enregistrer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="textes" value={mainTab} onValueChange={setMainTab}>
          <TabsList>
            <TabsTrigger value="textes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Textes
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
          </TabsList>

          {/* Onglet Textes */}
          <TabsContent value="textes" className="space-y-6">
            {/* Statistiques */}
            {stats && (stats as TranslationStats) ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">
                      Statistiques des traductions
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(stats as TranslationStats).totalKeys}
                      </div>
                      <div className="text-sm text-blue-600">Total clés</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(stats as TranslationStats).frTranslations}
                      </div>
                      <div className="text-sm text-green-600">Français</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(stats as TranslationStats).enTranslations}
                      </div>
                      <div className="text-sm text-purple-600">Anglais</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {(stats as TranslationStats).missingFr}
                      </div>
                      <div className="text-sm text-orange-600">FR manquant</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {(stats as TranslationStats).missingEn}
                      </div>
                      <div className="text-sm text-red-600">EN manquant</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Avertissement professionnel */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-amber-900">
                      Information importante sur la cohérence des traductions
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Lors de la modification des textes, veillez à maintenir la
                      cohérence entre les versions française et anglaise.
                      Assurez-vous que le sens, le ton et les informations
                      techniques restent identiques dans les deux langues. Les
                      clés de traduction doivent être conservées et ne pas être
                      modifiées arbitrairement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="editor"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Interface simple
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Mode JSON brut
                </TabsTrigger>
              </TabsList>

              {/* Interface simple d'édition */}
              <TabsContent value="editor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="h-5 w-5" />
                      Gestion des traductions - Interface simple
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contrôles de filtrage */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex flex-col sm:flex-row gap-2 flex-1">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher une clé ou un texte..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <select
                          value={selectedLanguage}
                          onChange={(e) =>
                            setSelectedLanguage(
                              e.target.value as "all" | "fr" | "en"
                            )
                          }
                          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="all">Toutes les langues</option>
                          <option value="fr">Français uniquement</option>
                          <option value="en">Anglais uniquement</option>
                        </select>
                      </div>
                    </div>

                    {/* Pagination info */}
                    {paginatedData && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          Affichage de{" "}
                          {(paginatedData.pagination.page - 1) *
                            paginatedData.pagination.limit +
                            1}{" "}
                          à{" "}
                          {Math.min(
                            paginatedData.pagination.page *
                              paginatedData.pagination.limit,
                            paginatedData.pagination.total
                          )}{" "}
                          sur {paginatedData.pagination.total} traductions
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={
                              !paginatedData.pagination.hasPrevPage || isLoading
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Précédent
                          </Button>
                          <span className="px-3 py-1 bg-muted rounded">
                            Page {paginatedData.pagination.page} sur{" "}
                            {paginatedData.pagination.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={
                              !paginatedData.pagination.hasNextPage || isLoading
                            }
                          >
                            Suivant
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Tableau des traductions */}
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Clé</TableHead>
                            <TableHead className="w-3/8">Français</TableHead>
                            <TableHead className="w-3/8">Anglais</TableHead>
                            <TableHead className="w-24 text-center">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center py-8"
                              >
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                Chargement...
                              </TableCell>
                            </TableRow>
                          ) : filteredTranslations.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center py-8 text-muted-foreground"
                              >
                                Aucune traduction trouvée.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredTranslations.map((translation) => (
                              <TableRow
                                key={translation.key}
                                className={
                                  hasPendingChanges(translation.key)
                                    ? "bg-yellow-50"
                                    : ""
                                }
                              >
                                <TableCell className="font-mono text-xs">
                                  <div className="flex items-center gap-2">
                                    {translation.key}
                                    {hasPendingChanges(translation.key) && (
                                      <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-700"
                                      >
                                        Modifié
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Textarea
                                    value={getCurrentValue(
                                      translation.key,
                                      "fr"
                                    )}
                                    onChange={(e) =>
                                      handleTranslationChange(
                                        translation.key,
                                        "fr",
                                        e.target.value
                                      )
                                    }
                                    className="min-h-[60px] resize-none"
                                    placeholder="Texte en français..."
                                  />
                                </TableCell>
                                <TableCell>
                                  <Textarea
                                    value={getCurrentValue(
                                      translation.key,
                                      "en"
                                    )}
                                    onChange={(e) =>
                                      handleTranslationChange(
                                        translation.key,
                                        "en",
                                        e.target.value
                                      )
                                    }
                                    className="min-h-[60px] resize-none"
                                    placeholder="Texte en anglais..."
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleEditTranslation(translation)
                                      }
                                      className="h-8 w-8"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination en bas */}
                    {paginatedData &&
                      paginatedData.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1 || isLoading}
                          >
                            1
                          </Button>
                          {currentPage > 3 && <span className="px-2">...</span>}
                          {Array.from({ length: 5 }, (_, i) => {
                            const pageNum = currentPage - 2 + i;
                            if (
                              pageNum < 1 ||
                              pageNum > paginatedData.pagination.totalPages
                            )
                              return null;
                            if (
                              pageNum === 1 ||
                              pageNum === paginatedData.pagination.totalPages
                            )
                              return null;

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pageNum === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setCurrentPage(pageNum)}
                                disabled={isLoading}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                          {currentPage <
                            paginatedData.pagination.totalPages - 2 && (
                            <span className="px-2">...</span>
                          )}
                          {paginatedData.pagination.totalPages > 1 && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                setCurrentPage(
                                  paginatedData.pagination.totalPages
                                )
                              }
                              disabled={
                                currentPage ===
                                  paginatedData.pagination.totalPages ||
                                isLoading
                              }
                            >
                              {paginatedData.pagination.totalPages}
                            </Button>
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mode JSON brut */}
              <TabsContent value="json" className="space-y-6">
                <Card>              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Édition JSON brute
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mode avancé : éditez directement le fichier JSON de
                  traductions.
                  <strong className="text-red-600"> Attention</strong> : une
                  syntaxe incorrecte peut casser le site. Pour les gros fichiers (&gt;5MB), la sauvegarde peut prendre jusqu'à 30 secondes.
                </p>
              </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={rawJsonValue}
                      onChange={(e) => setRawJsonValue(e.target.value)}
                      className="min-h-[500px] font-mono text-sm"
                      placeholder="Contenu JSON des traductions..."
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setRawJsonValue(
                            JSON.stringify(fullTranslations, null, 2)
                          )
                        }
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Réinitialiser
                      </Button>
                      <Button
                        onClick={handleSaveJsonChanges}
                        disabled={updateFullJsonMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Onglet Images */}
          <TabsContent value="images" className="space-y-6">
            {/* Statistiques des images */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">
                    Statistiques des illustrations
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {illustrationsData?.pagination.total || 0}
                    </div>
                    <div className="text-sm text-blue-600">
                      Total illustrations
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {illustrationsData?.categories.length || 0}
                    </div>
                    <div className="text-sm text-purple-600">Catégories</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {illustrationsData?.illustrations.filter(
                        (img) => img.category === "hero"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-orange-600">Images héro</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {illustrationsData?.illustrations.filter(
                        (img) => img.category === "branding"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-green-600">Branding</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avertissement pour les images */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">
                      Information importante sur la gestion des illustrations
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Ces images d'illustration apparaissent dans les pages
                      About, Design en Action, Sur-mesure et Shop Focus. Les
                      modifications d'URL affectent directement l'affichage.
                      Privilégiez les formats WebP optimisés et testez les URLs
                      avant de les enregistrer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="editor"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Interface simple
                </TabsTrigger>
                <TabsTrigger value="json-images" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Mode JSON brut
                </TabsTrigger>
              </TabsList>

              {/* Interface simple d'édition des images */}
              <TabsContent value="editor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Gestion des illustrations - Interface simple
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                {/* Contrôles de filtrage et ajout */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une illustration..."
                        value={imageSearchQuery}
                        onChange={(e) => setImageSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">Toutes les catégories</option>
                      {illustrationsData?.categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pagination info */}
                {illustrationsData && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      Affichage de{" "}
                      {(illustrationsData.pagination.page - 1) *
                        illustrationsData.pagination.limit +
                        1}{" "}
                      à{" "}
                      {Math.min(
                        illustrationsData.pagination.page *
                          illustrationsData.pagination.limit,
                        illustrationsData.pagination.total
                      )}{" "}
                      sur {illustrationsData.pagination.total} illustrations
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setImageCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={
                          !illustrationsData.pagination.hasPrevPage ||
                          illustrationsLoading
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      <span className="px-3 py-1 bg-muted rounded">
                        Page {illustrationsData.pagination.page} sur{" "}
                        {illustrationsData.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setImageCurrentPage((prev) => prev + 1)}
                        disabled={
                          !illustrationsData.pagination.hasNextPage ||
                          illustrationsLoading
                        }
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Liste des images */}
                {illustrationsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Chargement des illustrations...</p>
                    </div>
                  </div>
                ) : illustrationsData?.illustrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Aucune illustration trouvée.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {illustrationsData?.illustrations.map((illustration) => (
                      <Card key={illustration.key} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                          <img
                            src={illustration.url}
                            alt={illustration.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {illustration.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {illustration.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {illustration.category}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            <p className="truncate">Clé: {illustration.key}</p>
                            <p className="truncate">URL: {illustration.url}</p>
                            {illustration.pages &&
                              illustration.pages.length > 0 && (
                                <p>Pages: {illustration.pages.join(", ")}</p>
                              )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() =>
                                handleEditIllustration(illustration)
                              }
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mode JSON brut pour les illustrations */}
          <TabsContent value="json-images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Édition JSON brute des illustrations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mode avancé : éditez directement le fichier JSON des
                  illustrations.
                  <strong className="text-red-600"> Attention</strong> : une
                  syntaxe incorrecte peut casser l'affichage des images. Pour les gros fichiers (&gt;5MB), la sauvegarde peut prendre jusqu'à 30 secondes.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={rawIllustrationsJsonValue}
                  onChange={(e) => setRawIllustrationsJsonValue(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                  placeholder="Contenu JSON des illustrations..."
                />
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setRawIllustrationsJsonValue(
                        JSON.stringify(fullIllustrations, null, 2)
                      )
                    }
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={handleSaveIllustrationsJsonChanges}
                    disabled={updateFullIllustrationsJsonMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  </div>

      {/* Dialog d'édition de traduction */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la traduction</DialogTitle>
            <DialogDescription>
              Clé :{" "}
              <code className="bg-muted px-1 py-0.5 rounded">
                {editingTranslation?.key}
              </code>
            </DialogDescription>
          </DialogHeader>
          {editingTranslation && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Texte français
                </label>
                <Textarea
                  value={editingTranslation.fr}
                  onChange={(e) =>
                    setEditingTranslation((prev) =>
                      prev ? { ...prev, fr: e.target.value } : null
                    )
                  }
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Texte anglais
                </label>
                <Textarea
                  value={editingTranslation.en}
                  onChange={(e) =>
                    setEditingTranslation((prev) =>
                      prev ? { ...prev, en: e.target.value } : null
                    )
                  }
                  className="min-h-[80px]"
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
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteKey} onOpenChange={() => setDeleteKey(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la traduction pour la clé{" "}
              <code className="bg-muted px-1 py-0.5 rounded">{deleteKey}</code>{" "}
              ? Cette action est irréversible.
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

      {/* Dialog d'édition d'illustration */}
      <Dialog open={showEditImageDialog} onOpenChange={setShowEditImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'illustration</DialogTitle>
            <DialogDescription>
              Titre :{" "}
              <code className="bg-muted px-1 py-0.5 rounded">
                {editingImage?.title}
              </code>
            </DialogDescription>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre de l'illustration
                </label>
                <Input
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL de l'image
                </label>
                <Input
                  value={editingImage.url}
                  onChange={(e) =>
                    setEditingImage((prev) =>
                      prev ? { ...prev, url: e.target.value } : null
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (facultatif)
                </label>
                <Textarea
                  value={editingImage.description}
                  onChange={(e) =>
                    setEditingImage((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Catégorie
                </label>
                <select
                  value={editingImage.category}
                  onChange={(e) =>
                    setEditingImage((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
                  }
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm w-full"
                >
                  <option value="general">Général</option>
                  <option value="products">Produits</option>
                  <option value="interface">Interface</option>
                  <option value="banners">Bannières</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditImageDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveIllustrationEdit}
              disabled={updateIllustrationMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
