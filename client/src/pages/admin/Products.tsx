import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  color: z.string().min(1, "La couleur est requise"),
  description: z.string().min(1, "La description est requise"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  stock: z.coerce.number().int().nonnegative("Le stock doit être positif ou zéro"),
  imageUrl: z.string().min(1, "L'URL de l'image est requise"),
});

export default function AdminProducts() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  const { mutate: updateProduct } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (selectedProduct) {
        return apiRequest("PUT", `/api/products/${selectedProduct.id}`, data);
      } else {
        return apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      toast({
        title: selectedProduct ? "Produit mis à jour" : "Produit créé",
        description: selectedProduct 
          ? "Le produit a été mis à jour avec succès." 
          : "Le produit a été créé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du produit.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du produit.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      name: product.name,
      color: product.color,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    form.reset({
      name: "FOCUS.01",
      color: "",
      description: "Lampe d'appoint imaginée et fabriquée par Anatole Collet. Réaliser en PLA écoresponsable et en chêne écogéré, livré avec une ampoule LED de 60W E14 et un câble avec interrupteur de 1m50.",
      price: 89.00,
      stock: 10,
      imageUrl: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateProduct(data);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-12 h-12 relative">
          <img 
            src={row.original.imageUrl}
            alt={row.original.name}
            className="object-contain w-full h-full"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "color",
      header: "Couleur",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.color}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => <span>{formatPrice(row.original.price)}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <Badge variant={stock > 0 ? "outline" : "destructive"}>
            {stock > 0 ? `${stock} en stock` : "Épuisé"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleDelete(product)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des produits</h1>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
        
        <DataTable 
          columns={columns} 
          data={products} 
          searchColumn="Rechercher un produit"
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Modifier le produit" : "Créer un nouveau produit"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (€)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {selectedProduct ? "Mettre à jour" : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
