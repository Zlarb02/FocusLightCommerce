import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  ProductVariation,
  ProductWithVariations,
  InsertProduct,
  InsertProductVariation,
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
  imageUrl: z.string().min(1, "L'URL de l'image est requise"),
  price: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().int().min(0).default(0),
});

type VariationFormValues = z.infer<typeof variationFormSchema>;

export default function Stocks() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  // États pour la gestion des produits
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
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
      imageUrl: "",
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
      imageUrl: "",
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

  // Soumettre le formulaire de variation
  const onSubmitVariation = (data: VariationFormValues) => {
    createVariation(data);
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
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={openProductDialog}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
        </Button>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-start">
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
                <p className="text-sm text-yellow-800">
                  Cet onglet affiche uniquement les variations existantes. Pour
                  ajouter une nouvelle variation à un produit, veuillez aller
                  dans l'onglet{" "}
                  <strong>"Tous les produits (gérer les variations)"</strong>.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead className="w-16">Image</TableHead>
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
                                <div className="w-10 h-10 relative">
                                  <img
                                    src={variation.imageUrl}
                                    alt={`${product.name} ${variation.variationValue}`}
                                    className="object-contain w-full h-full"
                                  />
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
                                      openDeleteVariationAlert(variation)
                                    }
                                    title="Supprimer la variation"
                                    className="text-red-500 hover:bg-red-50"
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
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 flex items-start">
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
                <p className="text-sm text-blue-800">
                  Dans cet onglet, vous pouvez voir tous les produits et gérer
                  leurs variations. Pour ajouter une variation à un produit,
                  cliquez sur le bouton <strong>"+ Variation"</strong>.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Variations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun produit trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.id}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <span className="line-clamp-2">
                            {product.description}
                          </span>
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <Badge>
                            {product.variations ? product.variations.length : 0}{" "}
                            variation(s)
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openVariationDialog(product)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Variation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openProductEditDialog(product)}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Éditer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => openDeleteProductAlert(product)}
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
                      src={selectedVariation.imageUrl}
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
        onOpenChange={setIsVariationDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter une variation</DialogTitle>
            {productForVariation && (
              <DialogDescription>
                Pour le produit : {productForVariation.name}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...variationForm}>
            <form
              onSubmit={variationForm.handleSubmit(onSubmitVariation)}
              className="space-y-4"
            >
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
                      <Input {...field} placeholder="Ex: Rouge, XL, Bois..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={variationForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="images/nom-image.png" />
                    </FormControl>
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
                        {...field}
                        value={field.value === null ? "" : field.value}
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVariationDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
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
    </DashboardLayout>
  );
}
