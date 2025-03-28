import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCheckout } from "@/hooks/useCheckout";
import { Customer } from "@shared/schema";

const shippingSchema = z.object({
  address: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(5, "Le code postal doit comporter au moins 5 caractères"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
  saveAddress: z.boolean().optional(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

interface ShippingProps {
  onNext: () => void;
  onBack: () => void;
}

export function Shipping({ onNext, onBack }: ShippingProps) {
  const { customer, updateCustomer } = useCheckout();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address: customer?.address || "",
      postalCode: customer?.postalCode || "",
      city: customer?.city || "",
      country: customer?.country || "FR",
      saveAddress: false,
    },
  });

  const onSubmit = (data: ShippingFormValues) => {
    const { saveAddress, ...shippingData } = data;
    updateCustomer(shippingData as Partial<Customer>);
    onNext();
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-6">Adresse de livraison</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="BE">Belgique</SelectItem>
                    <SelectItem value="CH">Suisse</SelectItem>
                    <SelectItem value="LU">Luxembourg</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="saveAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Sauvegarder cette adresse pour mes prochains achats
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={onBack}
            >
              Retour
            </Button>
            <Button type="submit" className="w-2/3">
              Continuer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
