import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  Plus,
  Trash2,
  GripVertical,
  Save,
  RotateCcw,
  Settings,
  Eye,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Slide {
  url: string;
  alt: string;
  order: number;
}

interface SliderConfig {
  featuredProductId: number;
  autoPlayInterval: number;
  slides: Slide[];
  productName?: string;
}

interface Product {
  id: number;
  name: string;
}

interface Media {
  id: number;
  filename: string;
  path: string;
  type: "image" | "video" | "other";
}

export default function SliderConfig() {
  const { toast } = useToast();
  const [isAddSlideDialogOpen, setIsAddSlideDialogOpen] = useState(false);
  const [isDeleteSlideDialogOpen, setIsDeleteSlideDialogOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [newSlideAlt, setNewSlideAlt] = useState("");
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<SliderConfig | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Charger la config du slider
  const { data: sliderConfig, isLoading: configLoading } = useQuery<SliderConfig>({
    queryKey: ["/api/slider/config"],
  });

  // Charger les produits pour le sélecteur
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Charger les médias pour le sélecteur
  const { data: medias = [] } = useQuery<Media[]>({
    queryKey: ["/api/medias"],
  });

  // Initialiser le config local quand les données sont chargées
  useEffect(() => {
    if (sliderConfig && !pendingConfig) {
      setPendingConfig(sliderConfig);
    }
  }, [sliderConfig]);

  // Preview auto-play
  useEffect(() => {
    if (isPreviewPlaying && pendingConfig && pendingConfig.slides.length > 0) {
      const interval = setInterval(() => {
        setPreviewIndex((prev) => (prev + 1) % pendingConfig.slides.length);
      }, pendingConfig.autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPreviewPlaying, pendingConfig]);

  // Mutation pour mettre à jour la config complète
  const updateConfigMutation = useMutation({
    mutationFn: async (config: SliderConfig) => {
      return apiRequest("PUT", "/api/slider/config", {
        featuredProductId: config.featuredProductId,
        autoPlayInterval: config.autoPlayInterval,
        slides: config.slides,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider/config"] });
      toast({
        title: "Succès",
        description: "Configuration du slider mise à jour",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  // Ajouter un slide
  const handleAddSlide = () => {
    if (!newSlideUrl.trim() || !pendingConfig) return;

    const maxOrder = pendingConfig.slides.length > 0
      ? Math.max(...pendingConfig.slides.map(s => s.order))
      : 0;

    setPendingConfig({
      ...pendingConfig,
      slides: [
        ...pendingConfig.slides,
        {
          url: newSlideUrl.trim(),
          alt: newSlideAlt.trim() || `Slide ${maxOrder + 1}`,
          order: maxOrder + 1,
        },
      ],
    });

    setNewSlideUrl("");
    setNewSlideAlt("");
    setIsAddSlideDialogOpen(false);
  };

  // Supprimer un slide
  const handleDeleteSlide = () => {
    if (slideToDelete === null || !pendingConfig) return;

    const newSlides = pendingConfig.slides
      .filter(s => s.order !== slideToDelete)
      .map((slide, index) => ({ ...slide, order: index + 1 }));

    setPendingConfig({
      ...pendingConfig,
      slides: newSlides,
    });

    setSlideToDelete(null);
    setIsDeleteSlideDialogOpen(false);
  };

  // Réordonner un slide
  const handleMoveSlide = (currentOrder: number, direction: "up" | "down") => {
    if (!pendingConfig) return;

    const slides = [...pendingConfig.slides].sort((a, b) => a.order - b.order);
    const currentIndex = slides.findIndex(s => s.order === currentOrder);

    if (direction === "up" && currentIndex > 0) {
      // Échanger avec le précédent
      const temp = slides[currentIndex - 1].order;
      slides[currentIndex - 1].order = slides[currentIndex].order;
      slides[currentIndex].order = temp;
    } else if (direction === "down" && currentIndex < slides.length - 1) {
      // Échanger avec le suivant
      const temp = slides[currentIndex + 1].order;
      slides[currentIndex + 1].order = slides[currentIndex].order;
      slides[currentIndex].order = temp;
    }

    setPendingConfig({
      ...pendingConfig,
      slides: slides.sort((a, b) => a.order - b.order),
    });
  };

  // Sélectionner un média
  const handleSelectMedia = (media: Media) => {
    setNewSlideUrl(media.path);
    setNewSlideAlt(media.filename.replace(/\.[^/.]+$/, ""));
    setIsMediaSelectorOpen(false);
  };

  // Changer le produit vedette
  const handleProductChange = (productId: string) => {
    if (!pendingConfig) return;
    const product = products.find(p => p.id === parseInt(productId));
    setPendingConfig({
      ...pendingConfig,
      featuredProductId: parseInt(productId),
      productName: product?.name,
    });
  };

  // Changer l'intervalle
  const handleIntervalChange = (value: string) => {
    if (!pendingConfig) return;
    const interval = parseInt(value);
    if (interval >= 1000 && interval <= 10000) {
      setPendingConfig({
        ...pendingConfig,
        autoPlayInterval: interval,
      });
    }
  };

  // Sauvegarder
  const handleSave = () => {
    if (pendingConfig) {
      updateConfigMutation.mutate(pendingConfig);
    }
  };

  // Réinitialiser
  const handleReset = () => {
    if (sliderConfig) {
      setPendingConfig(sliderConfig);
    }
  };

  // Vérifier si des changements sont en attente
  const hasChanges = JSON.stringify(pendingConfig) !== JSON.stringify(sliderConfig);

  const imageMedias = medias.filter(m => m.type === "image");

  if (configLoading) {
    return (
      <DashboardLayout title="Configuration Landing Page">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de la configuration...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Configuration Landing Page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Landing Page</h1>
            <p className="text-muted-foreground">
              Configurez le slider et le produit vedette de la page d'accueil
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
                Modifications non sauvegardées
              </Badge>
            )}
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || updateConfigMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Paramètres généraux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Produit vedette */}
              <div className="space-y-2">
                <Label>Produit vedette</Label>
                <Select
                  value={pendingConfig?.featuredProductId?.toString()}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Le nom de ce produit sera affiché sur l'overlay de la landing page
                </p>
              </div>

              {/* Intervalle auto-play */}
              <div className="space-y-2">
                <Label>Intervalle de défilement (ms)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1000}
                    max={10000}
                    step={100}
                    value={pendingConfig?.autoPlayInterval || 3500}
                    onChange={(e) => handleIntervalChange(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    {((pendingConfig?.autoPlayInterval || 3500) / 1000).toFixed(1)} secondes
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Délai entre chaque image du slider (1000-10000ms)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aperçu du slider
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingConfig && pendingConfig.slides.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="aspect-[3/4] w-full max-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative shadow-lg">
                      <img
                        src={pendingConfig.slides.sort((a, b) => a.order - b.order)[previewIndex]?.url}
                        alt={pendingConfig.slides.sort((a, b) => a.order - b.order)[previewIndex]?.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {pendingConfig.slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setPreviewIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === previewIndex
                                ? "bg-white"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Produit affiché : <strong>{pendingConfig.productName || "Non défini"}</strong>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                    >
                      {isPreviewPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Lecture
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="aspect-[3/4] w-full max-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-center text-muted-foreground">
                      <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune image configurée</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Liste des slides */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Images du slider ({pendingConfig?.slides.length || 0})
            </CardTitle>
            <Button onClick={() => setIsAddSlideDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une image
            </Button>
          </CardHeader>
          <CardContent>
            {pendingConfig && pendingConfig.slides.length > 0 ? (
              <div className="space-y-3">
                {pendingConfig.slides
                  .sort((a, b) => a.order - b.order)
                  .map((slide, index) => (
                    <div
                      key={slide.order}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMoveSlide(slide.order, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMoveSlide(slide.order, "down")}
                          disabled={index === pendingConfig.slides.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-16 h-[85px] bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={slide.url}
                          alt={slide.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{slide.alt}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {slide.url}
                        </p>
                      </div>
                      <Badge variant="outline">#{slide.order}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setSlideToDelete(slide.order);
                          setIsDeleteSlideDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Aucune image dans le slider
                </p>
                <Button onClick={() => setIsAddSlideDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la première image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog d'ajout de slide */}
      <Dialog open={isAddSlideDialogOpen} onOpenChange={setIsAddSlideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une image au slider</DialogTitle>
            <DialogDescription>
              Entrez l'URL de l'image ou sélectionnez-la depuis vos médias
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL de l'image</Label>
              <div className="flex gap-2">
                <Input
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button
                  variant="outline"
                  onClick={() => setIsMediaSelectorOpen(true)}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texte alternatif (description)</Label>
              <Input
                value={newSlideAlt}
                onChange={(e) => setNewSlideAlt(e.target.value)}
                placeholder="Description de l'image..."
              />
            </div>
            {newSlideUrl && (
              <div className="flex justify-center">
                <div className="aspect-[3/4] w-full max-w-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={newSlideUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSlideDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddSlide} disabled={!newSlideUrl.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de sélection de média */}
      <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Sélectionner une image</DialogTitle>
            <DialogDescription>
              Choisissez une image depuis votre bibliothèque de médias
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[50vh] p-1">
            {imageMedias.length > 0 ? (
              imageMedias.map((media) => (
                <button
                  key={media.id}
                  onClick={() => handleSelectMedia(media)}
                  className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={media.path}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Aucune image disponible dans les médias
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression */}
      <AlertDialog
        open={isDeleteSlideDialogOpen}
        onOpenChange={setIsDeleteSlideDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera l'image du slider. Cette modification ne
              sera effective qu'après avoir sauvegardé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlide}
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
