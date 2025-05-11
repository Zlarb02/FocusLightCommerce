import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Définir l'interface pour les médias
interface Media {
  id: number;
  filename: string;
  path: string;
  type: "image" | "video" | "other";
  size: number;
  createdAt: string;
}

// Schema pour l'upload de média
const mediaUploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Veuillez sélectionner un fichier",
    })
    .refine((files) => files[0]?.size <= 10 * 1024 * 1024, {
      message: "Le fichier ne doit pas dépasser 10 MB",
    }),
  type: z.enum(["image", "video", "other"], {
    required_error: "Veuillez sélectionner un type de média",
  }),
});

type MediaUploadValues = z.infer<typeof mediaUploadSchema>;

export default function Medias() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDeleteMediaAlertOpen, setIsDeleteMediaAlertOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Récupération des médias
  const {
    data: medias = [],
    isLoading,
    error,
  } = useQuery<Media[]>({
    queryKey: ["/api/medias"],
    enabled: true,
  });

  // Handle query error
  if (error) {
    toast({
      title: "Erreur",
      description:
        "Impossible de charger les médias. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
    console.error("Erreur lors du chargement des médias:", error);
  }

  // Formulaire pour l'upload de médias
  const uploadForm = useForm<MediaUploadValues>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      type: "image",
    },
  });

  // Mutation pour l'upload de média
  const { mutate: uploadMedia, isPending: isUploading } = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/medias/upload", data, {
        formData: true,
      });
    },
    onSuccess: () => {
      // Nettoyer la prévisualisation
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/medias"] });
      toast({
        title: "Média uploadé",
        description: "Le fichier a été uploadé avec succès.",
      });
      handleCloseUploadDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description:
          error?.message ||
          "Une erreur est survenue lors de l'upload du fichier.",
        variant: "destructive",
      });
      console.error("Erreur d'upload:", error);
    },
  });

  // Mutation pour la suppression de média
  const { mutate: deleteMedia } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/medias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medias"] });
      toast({
        title: "Média supprimé",
        description: "Le fichier a été supprimé avec succès.",
      });
      setIsDeleteMediaAlertOpen(false);
      setSelectedMedia(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression du fichier.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmitUpload = (data: MediaUploadValues) => {
    const formData = new FormData();

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
      formData.append("type", data.type);
      uploadMedia(formData);
    }
  };

  // Gérer l'aperçu du fichier lors de la sélection
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Créer l'URL de prévisualisation pour les images
      if (file.type.startsWith("image/")) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        uploadForm.setValue("type", "image");
      } else if (file.type.startsWith("video/")) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        uploadForm.setValue("type", "video");
      } else {
        setPreviewUrl(null);
        uploadForm.setValue("type", "other");
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const openDeleteMediaAlert = (media: Media) => {
    setSelectedMedia(media);
    setIsDeleteMediaAlertOpen(true);
  };

  // Nettoyer la prévisualisation à la fermeture
  const handleCloseUploadDialog = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsUploadDialogOpen(false);
    resetUploadForm();
  };

  // Fonction pour réinitialiser le formulaire d'upload
  const resetUploadForm = () => {
    uploadForm.reset({
      type: "image",
      file: undefined,
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Filtrer les médias selon le terme de recherche et le type sélectionné
  const filteredMedias = medias.filter((media) =>
    media.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour convertir les URLs des médias
  const getMediaUrl = (path: string) => {
    try {
      // Extraire le chemin relatif du fichier à partir de l'URL complète
      const url = new URL(path);
      // Renvoyer uniquement le chemin relatif (généralement /uploads/nom-fichier.ext)
      return url.pathname;
    } catch (e) {
      // Si ce n'est pas une URL valide, retourner le chemin tel quel
      return path;
    }
  };

  return (
    <DashboardLayout title="Gestion des médias">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Input
            placeholder="Rechercher un fichier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter un média
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous les médias</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="others">Autres fichiers</TabsTrigger>
          </TabsList>

          {["all", "images", "videos", "others"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <div className="bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Type</TableHead>
                      <TableHead className="w-16">Aperçu</TableHead>
                      <TableHead>Nom du fichier</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucun média trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMedias
                        .filter(
                          (media) =>
                            tabValue === "all" ||
                            (tabValue === "images" && media.type === "image") ||
                            (tabValue === "videos" && media.type === "video") ||
                            (tabValue === "others" && media.type === "other")
                        )
                        .map((media) => (
                          <TableRow key={media.id}>
                            <TableCell>{getMediaIcon(media.type)}</TableCell>
                            <TableCell>
                              {media.type === "image" ? (
                                <div className="w-10 h-10 relative">
                                  <img
                                    src={getMediaUrl(media.path)}
                                    alt={media.filename}
                                    className="object-contain w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                                  {getMediaIcon(media.type)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{media.filename}</TableCell>
                            <TableCell>{formatBytes(media.size)}</TableCell>
                            <TableCell>
                              {new Date(media.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(getMediaUrl(media.path), "_blank")
                                }
                              >
                                <ExternalLink className="h-3 w-3 mr-1" /> Voir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => openDeleteMediaAlert(media)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Boîte de dialogue pour l'upload de média */}
      <Dialog open={isUploadDialogOpen} onOpenChange={handleCloseUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un média</DialogTitle>
            <DialogDescription>
              Choisissez un fichier à uploader dans la médiathèque.
            </DialogDescription>
          </DialogHeader>
          <Form {...uploadForm}>
            <form
              onSubmit={uploadForm.handleSubmit(onSubmitUpload)}
              className="space-y-4"
            >
              <FormField
                control={uploadForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de média</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Vidéo</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={uploadForm.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Fichier</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleFileChange(e.target.files);
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                    {previewUrl && (
                      <div className="mt-2">
                        {uploadForm.getValues("type") === "image" ? (
                          <div className="w-full max-h-32 overflow-hidden rounded-md">
                            <img
                              src={previewUrl}
                              alt="Prévisualisation"
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ) : uploadForm.getValues("type") === "video" ? (
                          <div className="w-full rounded-md">
                            <video
                              src={previewUrl}
                              controls
                              className="max-h-32 w-full"
                            >
                              Votre navigateur ne supporte pas la lecture de
                              vidéos
                            </video>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseUploadDialog}
                  disabled={isUploading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Upload en cours...
                    </div>
                  ) : (
                    "Uploader"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alerte de confirmation de suppression d'un média */}
      <AlertDialog
        open={isDeleteMediaAlertOpen}
        onOpenChange={setIsDeleteMediaAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ce fichier ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le fichier{" "}
              <strong>{selectedMedia?.filename}</strong>. Cette action ne peut
              pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => selectedMedia && deleteMedia(selectedMedia.id)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
