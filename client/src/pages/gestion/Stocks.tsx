import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  ProductVariation,
  ProductWithVariations,
  InsertProduct,
  InsertProductVariation,
  VariationImage,
} from "@shared/schema";
import { formatPrice } from "@/lib/utils";
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
  Edit,
  Plus,
  Search,
  AlertTriangle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductPageSettings } from "@/components/gestion/ProductPageSettings";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const stockFormSchema = z.object({
  stock: z.coerce
    .number()
    .int("La quantité doit être un nombre entier")
    .min(0, "La quantité ne peut pas être négative"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

const productFormSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.coerce.number().min(0.01, "Le prix doit être supérieur à 0"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const variationFormSchema = z.object({
  productId: z.coerce.number(),
  variationType: z.string().min(1, "Le type de variation est requis"),
  variationValue: z.string().min(1, "La valeur de variation est requise"),
  images: z
    .array(
      z.object({
        url: z.string().min(1, "L'URL de l'image est requise"),
        order: z.number().int().min(0),
      })
    )
    .min(1, "Au moins une image est requise"),
  price: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().int().min(0).default(0),
});

type VariationFormValues = z.infer<typeof variationFormSchema>;

export default function Stocks() {
  // Mutation pour mettre à jour une variation
  const { mutate: updateVariation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertProductVariation>;
    }) => {
      return apiRequest("PUT", `/api/products/variation/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Variation modifiée",
        description: "La variation a été modifiée avec succès.",
      });
      setIsVariationDialogOpen(false);
      resetVariationForm();
      setEditingVariation(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la modification de la variation.",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  // État pour savoir si on édite une variation
  const [editingVariation, setEditingVariation] =
    useState<ProductVariation | null>(null);

  // Ouvrir la boîte de dialogue de variation pour édition
  const openEditVariationDialog = (
    variation: ProductVariation,
    product: ProductWithVariations
  ) => {
    setProductForVariation(product);
    variationForm.reset({
      productId: product.id,
      variationType: variation.variationType,
      variationValue: variation.variationValue,
      images:
        variation.images && variation.images.length > 0
          ? variation.images
          : [{ url: "", order: 0 }],
      price: variation.price,
      stock: variation.stock,
    });
    setEditingVariation(variation);
    setIsVariationDialogOpen(true);
  };
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  // États pour la gestion des produits
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Fiche produit dont les réglages (sections, silhouette) sont dépliés.
  const [openSettings, setOpenSettings] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithVariations | null>(null);
  const [isDeleteProductAlertOpen, setIsDeleteProductAlertOpen] =
    useState(false);

  // États pour la gestion des variations
  const [isVariationDialogOpen, setIsVariationDialogOpen] = useState(false);
  const [isDeleteVariationAlertOpen, setIsDeleteVariationAlertOpen] =
    useState(false);
  const [productForVariation, setProductForVariation] =
    useState<ProductWithVariations | null>(null);

  // États pour la modale des images
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [selectedVariationImages, setSelectedVariationImages] = useState<{
    variation: ProductVariation;
    productName: string;
  } | null>(null);

  const { data: products = [], isLoading } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
    enabled: true,
  });

  // Formulaire pour la modification du stock
  const stockForm = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      stock: 0,
    },
  });

  // Formulaire pour la gestion des produits
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  // Formulaire pour la gestion des variations
  const variationForm = useForm<VariationFormValues>({
    resolver: zodResolver(variationFormSchema),
    defaultValues: {
      productId: 0,
      variationType: "color",
      variationValue: "",
      images: [{ url: "", order: 0 }],
      price: null,
      stock: 0,
    },
  });

  const { mutate: updateStock } = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      return apiRequest("PUT", `/api/products/variation/${id}/stock`, {
        stock,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Stock mis à jour",
        description: "Le stock de la variation a été mis à jour avec succès.",
      });
      setIsStockDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du stock.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Mutation pour créer un produit
  const { mutate: createProduct } = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
      setIsProductDialogOpen(false);
      resetProductForm();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Mutation pour mettre à jour un produit
  const { mutate: updateProduct } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertProduct>;
    }) => {
      return apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
      setIsProductDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour du produit.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Mutation pour supprimer un produit
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
      setIsDeleteProductAlertOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression du produit.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Mutation pour créer une variation
  const { mutate: createVariation } = useMutation({
    mutationFn: async (data: InsertProductVariation) => {
      return apiRequest("POST", "/api/products/variation", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Variation créée",
        description: "La variation a été créée avec succès.",
      });
      setIsVariationDialogOpen(false);
      resetVariationForm();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la variation.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Mutation pour supprimer une variation
  const { mutate: deleteVariation } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/variation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Variation supprimée",
        description: "La variation a été supprimée avec succès.",
      });
      setIsDeleteVariationAlertOpen(false);
      setSelectedVariation(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression de la variation.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Fonction pour réinitialiser le formulaire de produit
  const resetProductForm = () => {
    productForm.reset({
      name: "",
      description: "",
      price: 0,
    });
  };

  // Fonction pour réinitialiser le formulaire de variation
  const resetVariationForm = () => {
    variationForm.reset({
      productId: productForVariation?.id || 0,
      variationType: "color",
      variationValue: "",
      images: [],
      price: null,
      stock: 0,
    });
  };

  // Ouvrir la boîte de dialogue de stock
  const openStockDialog = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    // Trouver le produit parent de cette variation
    const parentProduct = products.find((p) => p.id === variation.productId);
    if (parentProduct) {
      setProductForVariation(parentProduct);
    }
    stockForm.reset({ stock: variation.stock });
    setIsStockDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de produit pour création
  const openProductDialog = () => {
    setSelectedProduct(null);
    resetProductForm();
    setIsProductDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de produit pour modification
  const openProductEditDialog = (product: ProductWithVariations) => {
    setSelectedProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setIsProductDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression de produit
  const openDeleteProductAlert = (product: ProductWithVariations) => {
    setSelectedProduct(product);
    setIsDeleteProductAlertOpen(true);
  };

  // Ouvrir la boîte de dialogue de variation pour création
  const openVariationDialog = (product: ProductWithVariations) => {
    setProductForVariation(product);
    resetVariationForm();
    variationForm.setValue("productId", product.id);
    setIsVariationDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression de variation
  const openDeleteVariationAlert = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    setIsDeleteVariationAlertOpen(true);
  };

  // Ouvrir la modale d'images
  const openImagesModal = (
    variation: ProductVariation,
    productName: string
  ) => {
    setSelectedVariationImages({ variation, productName });
    setIsImagesModalOpen(true);
  };

  // Soumettre le formulaire de stock
  const onSubmitStock = (data: StockFormValues) => {
    if (selectedVariation) {
      updateStock({ id: selectedVariation.id, stock: data.stock });
    }
  };

  // Soumettre le formulaire de produit
  const onSubmitProduct = (data: ProductFormValues) => {
    if (selectedProduct) {
      // Mettre à jour un produit existant
      updateProduct({ id: selectedProduct.id, data });
    } else {
      // Créer un nouveau produit
      createProduct(data);
    }
  };

  // Soumettre le formulaire de variation (création ou édition)
  const onSubmitVariation = (data: VariationFormValues) => {
    if (editingVariation) {
      updateVariation({ id: editingVariation.id, data });
    } else {
      createVariation(data);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variations?.some((variation) =>
        variation.variationValue
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );

  return (
    <DashboardLayout title="Gestion des stocks">
      {/* En-tête éditorial du catalogue (identité Alto) */}
      <div className="mb-6">
        <p
          className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-alto-orange"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          Catalogue · gestion
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2
              className="text-3xl font-bold text-alto-blue dark:text-alto-cream"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Produits
            </h2>
            {products && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {products.length} produit{products.length > 1 ? "s" : ""} ·{" "}
                {products.reduce((n, p) => n + (p.variations?.length || 0), 0)}{" "}
                variations
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-full pl-10"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              onClick={openProductDialog}
              className="rounded-full bg-alto-orange text-alto-cream hover:bg-alto-orange-soft"
              style={{ fontFamily: "var(--font-buttons)" }}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="variations">Variations produits</TabsTrigger>
            <TabsTrigger value="products">
              Tous les produits (gérer les variations)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="variations">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4 flex items-start">
              <svg
                className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Cet onglet affiche uniquement les variations existantes. Pour
                  ajouter une nouvelle variation à un produit, veuillez aller
                  dans l'onglet{" "}
                  <strong>"Tous les produits (gérer les variations)"</strong>.
                </p>
              </div>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead className="w-32">Images</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ||
                  filteredProducts.every(
                    (product) =>
                      !product.variations || product.variations.length === 0
                  ) ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Aucune variation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.flatMap((product) =>
                      product.variations
                        ? product.variations.map((variation) => (
                            <TableRow key={variation.id}>
                              <TableCell className="font-medium">
                                {variation.id}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col items-center gap-1">
                                  {variation.images &&
                                  variation.images.length > 0 ? (
                                    <>
                                      {/* Image principale cliquable */}
                                      <div className="relative group flex-shrink-0">
                                        <img
                                          src={variation.images[0].url}
                                          alt={`${product.name} ${variation.variationValue}`}
                                          className="w-12 h-12 object-cover rounded border hover:scale-110 transition-transform cursor-pointer"
                                          onClick={() =>
                                            openImagesModal(
                                              variation,
                                              product.name
                                            )
                                          }
                                        />
                                        {/* Tooltip avec image agrandie au survol */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                          <img
                                            src={variation.images[0].url}
                                            alt={`${product.name} ${variation.variationValue}`}
                                            className="w-32 h-32 object-cover rounded shadow-lg border-2 border-white"
                                          />
                                          <div className="text-center text-xs text-popover-foreground mt-1 bg-popover px-2 py-1 rounded shadow">
                                            {variation.images.length > 1
                                              ? `Voir les ${variation.images.length} images`
                                              : "Voir l'image"}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Badge avec le nombre total d'images */}
                                      {variation.images.length > 1 && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs cursor-pointer hover:bg-muted transition-colors flex-shrink-0"
                                          onClick={() =>
                                            openImagesModal(
                                              variation,
                                              product.name
                                            )
                                          }
                                          title="Voir toutes les images"
                                        >
                                          {variation.images.length} imgs
                                        </Badge>
                                      )}
                                    </>
                                  ) : (
                                    <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center flex-shrink-0">
                                      <svg
                                        className="w-6 h-6 text-muted-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {variation.variationValue}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatPrice(variation.price || product.price)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Badge
                                    variant={
                                      variation.stock <= 5
                                        ? "destructive"
                                        : "outline"
                                    }
                                  >
                                    {variation.stock > 0 ? (
                                      `${variation.stock} en stock`
                                    ) : (
                                      <span className="flex items-center">
                                        <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                                        Épuisé
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openStockDialog(variation)}
                                    title="Modifier le stock"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      openEditVariationDialog(
                                        variation,
                                        product
                                      )
                                    }
                                    title="Éditer la variation"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      openDeleteVariationAlert(variation)
                                    }
                                    title="Supprimer la variation"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        : []
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4 flex items-start">
              <svg
                className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Dans cet onglet, vous pouvez voir tous les produits et gérer
                  leurs variations. Pour ajouter une variation à un produit,
                  cliquez sur le bouton <strong>"+ Variation"</strong>.
                </p>
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
                Aucun produit trouvé
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const previewImage = product.variations?.[0]?.images?.[0]?.url;
                  const totalStock = (product.variations || []).reduce(
                    (n, v) => n + (v.stock || 0),
                    0
                  );
                  return (
                    <div
                      key={product.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Photo sur tuile blanche, fond flouté (pattern du site) */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-white">
                        {previewImage ? (
                          <>
                            <img
                              src={previewImage}
                              alt=""
                              aria-hidden
                              className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
                            />
                            <img
                              src={previewImage}
                              alt={product.name}
                              className="absolute inset-0 h-full w-full object-contain"
                            />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                            💡
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3
                            className="text-xl font-bold text-primary"
                            style={{ fontFamily: "var(--font-titles)" }}
                          >
                            {product.name}
                          </h3>
                          <span
                            className="font-bold"
                            style={{ fontFamily: "var(--font-titles)" }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {totalStock <= 0 && (
                            <span className="rounded-full bg-alto-brown/85 px-2.5 py-0.5 text-xs font-medium text-alto-cream">
                              Rupture de stock — prix masqué sur le site
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(product.variations || []).map((v) => (
                            <Badge
                              key={v.id}
                              variant={v.stock <= 0 ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {v.variationValue} · {v.stock > 0 ? `${v.stock}` : "épuisé"}
                            </Badge>
                          ))}
                          {(!product.variations ||
                            product.variations.length === 0) && (
                            <Badge variant="secondary" className="text-xs">
                              Aucune variation
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openVariationDialog(product)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Variation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openProductEditDialog(product)}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Éditer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteProductAlert(product)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                          </Button>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <a
                            href={`/shop/${product.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-alto-orange hover:underline"
                          >
                            Voir la page ↗
                          </a>
                          <a
                            href="/gestion/contenu"
                            className="text-muted-foreground hover:underline"
                          >
                            Textes de la page
                          </a>
                        </div>
                      </div>
                      </div>

                      {/* Réglages de la fiche : sections affichées et
                          silhouette. Repliés par défaut pour ne pas noyer la
                          liste des stocks. */}
                      <div className="mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-0 text-xs text-muted-foreground hover:bg-transparent"
                          onClick={() =>
                            setOpenSettings((id) =>
                              id === product.id ? null : product.id
                            )
                          }
                        >
                          {openSettings === product.id ? "▾" : "▸"} Réglages de
                          la fiche produit (sections et silhouette)
                        </Button>
                        {openSettings === product.id && (
                          <ProductPageSettings productId={product.id} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Boîte de dialogue pour modifier le stock */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la quantité en stock</DialogTitle>
          </DialogHeader>
          <Form {...stockForm}>
            <form
              onSubmit={stockForm.handleSubmit(onSubmitStock)}
              className="space-y-4"
            >
              {selectedVariation && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 relative">
                    <img
                      src={
                        selectedVariation.images[0]?.url ||
                        "/placeholder-image.png"
                      }
                      alt={selectedVariation.variationValue}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      Variation {selectedVariation.variationValue}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prix:{" "}
                      {formatPrice(
                        selectedVariation.price ||
                          productForVariation?.price ||
                          0
                      )}
                    </p>
                  </div>
                </div>
              )}

              <FormField
                control={stockForm.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité en stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStockDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour ajouter/modifier un produit */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Modifier un produit" : "Ajouter un produit"}
            </DialogTitle>
          </DialogHeader>
          <Form {...productForm}>
            <form
              onSubmit={productForm.handleSubmit(onSubmitProduct)}
              className="space-y-4"
            >
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={productForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de base (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {selectedProduct ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour ajouter une variation */}
      <Dialog
        open={isVariationDialogOpen}
        onOpenChange={(open) => {
          setIsVariationDialogOpen(open);
          if (!open) {
            setEditingVariation(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingVariation
                ? "Modifier une variation"
                : "Ajouter une variation"}
            </DialogTitle>
            {productForVariation && (
              <DialogDescription>
                Pour le produit : {productForVariation.name}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...variationForm}>
            <form onSubmit={variationForm.handleSubmit(onSubmitVariation)}>
              <div className="space-y-4">
                <FormField
                  control={variationForm.control}
                  name="variationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de variation</FormLabel>
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
                          <SelectItem value="color">Couleur</SelectItem>
                          <SelectItem value="size">Taille</SelectItem>
                          <SelectItem value="material">Matériau</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={variationForm.control}
                  name="variationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valeur de la variation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Rouge, XL, Bois..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={variationForm.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images de la variation</FormLabel>
                      <div className="space-y-3">
                        {field.value.map((img, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 items-center p-3 border rounded-lg bg-muted/50"
                          >
                            {/* Miniature de l'image */}
                            <div className="w-16 h-16 flex-shrink-0">
                              {img.url ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={img.url}
                                    alt={`Image ${idx + 1}`}
                                    className="w-full h-full object-cover rounded border"
                                    onError={(e) => {
                                      // Cacher l'image cassée et afficher le placeholder
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div
                                    className="absolute inset-0 w-full h-full bg-muted rounded border flex items-center justify-center"
                                    style={{ display: "none" }}
                                  >
                                    <svg
                                      className="w-6 h-6 text-muted-foreground"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full bg-muted rounded border flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Champs URL et ordre */}
                            <div className="flex-1 space-y-2">
                              <Input
                                value={img.url}
                                placeholder="URL de l'image"
                                onChange={(e) => {
                                  const newArr = [...field.value];
                                  newArr[idx] = { ...img, url: e.target.value };
                                  field.onChange(newArr);
                                }}
                              />
                              <div className="flex gap-2 items-center">
                                <label className="text-sm text-muted-foreground font-medium">
                                  Ordre:
                                </label>
                                <Input
                                  type="number"
                                  min={0}
                                  className="w-20"
                                  value={img.order}
                                  onChange={(e) => {
                                    const newArr = [...field.value];
                                    newArr[idx] = {
                                      ...img,
                                      order: Number(e.target.value),
                                    };
                                    field.onChange(newArr);
                                  }}
                                />
                              </div>
                            </div>

                            {/* Bouton de suppression */}
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newArr = field.value.filter(
                                  (_, i) => i !== idx
                                );
                                field.onChange(
                                  newArr.length
                                    ? newArr
                                    : [{ url: "", order: 0 }]
                                );
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Supprimer cette image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange([
                              ...field.value,
                              { url: "", order: field.value.length },
                            ]);
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une image
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={variationForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix spécifique (optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          placeholder="Laissez vide pour utiliser le prix de base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={variationForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock initial</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsVariationDialogOpen(false);
                    setEditingVariation(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingVariation ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alerte de confirmation de suppression d'un produit */}
      <AlertDialog
        open={isDeleteProductAlertOpen}
        onOpenChange={setIsDeleteProductAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ce produit ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le produit{" "}
              <strong>{selectedProduct?.name}</strong> et toutes ses variations.
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                selectedProduct && deleteProduct(selectedProduct.id)
              }
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alerte de confirmation de suppression d'une variation */}
      <AlertDialog
        open={isDeleteVariationAlertOpen}
        onOpenChange={setIsDeleteVariationAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette variation ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la variation{" "}
              <strong>{selectedVariation?.variationValue}</strong>. Cette action
              ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                selectedVariation && deleteVariation(selectedVariation.id)
              }
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale d'images */}
      <Dialog open={isImagesModalOpen} onOpenChange={setIsImagesModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Images de la variation{" "}
              {selectedVariationImages?.variation.variationValue}
            </DialogTitle>
            {selectedVariationImages && (
              <DialogDescription>
                Produit : <strong>{selectedVariationImages.productName}</strong>{" "}
                -{selectedVariationImages.variation.images.length} image(s)
                disponible(s)
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {selectedVariationImages?.variation.images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                onClick={() => {
                  // Ouvrir l'image en grand dans une nouvelle modale ou un nouvel onglet
                  window.open(image.url, "_blank");
                }}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={`Image ${index + 1} de la variation ${
                      selectedVariationImages.variation.variationValue
                    }`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2 text-sm font-medium text-gray-900">
                      Voir en grand
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1} /{" "}
                  {selectedVariationImages.variation.images.length}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImagesModalOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
