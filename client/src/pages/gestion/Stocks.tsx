import DashboardLayout from "./DashboardLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ProductVariation, ProductWithVariations } from "@shared/schema";
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
import { Edit, Plus, Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const stockFormSchema = z.object({
  stock: z.coerce
    .number()
    .int("La quantité doit être un nombre entier")
    .min(0, "La quantité ne peut pas être négative"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

export default function Stocks() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<ProductWithVariations[]>({
    queryKey: ["/api/products"],
    // Dans un environnement de production, cette requête serait activée
    enabled: true,
  });

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      stock: 0,
    },
  });

  const { mutate: updateStock } = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      return apiRequest("PUT", `/api/products/variations/${id}/stock`, {
        stock,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Stock mis à jour",
        description: "Le stock de la variation a été mis à jour avec succès.",
      });
      setIsDialogOpen(false);
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

  const openStockDialog = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    form.reset({ stock: variation.stock });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: StockFormValues) => {
    if (selectedVariation) {
      updateStock({ id: selectedVariation.id, stock: data.stock });
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
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
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
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun produit trouvé
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
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openStockDialog(variation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : []
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le stock</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      Prix: {formatPrice(selectedVariation.price || 0)}
                    </p>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
