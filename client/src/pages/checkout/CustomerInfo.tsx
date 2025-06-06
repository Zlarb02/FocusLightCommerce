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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCheckout } from "@/hooks/useCheckout";
import { Customer } from "@shared/schema";

const customerInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("L'email n'est pas valide"),
  phone: z.string().min(10, "Le numéro de téléphone n'est pas valide"),
});

type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;

interface CustomerInfoProps {
  onNext: () => void;
}

export function CustomerInfo({ onNext }: CustomerInfoProps) {
  const { customer, updateCustomer } = useCheckout();

  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    },
  });

  const onSubmit = (data: CustomerInfoFormValues) => {
    updateCustomer(data as Partial<Customer>);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-bold text-xl md:text-2xl mb-4 md:mb-6 text-gray-900 dark:text-gray-100">
        Vos informations
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 md:h-auto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Nom</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 md:h-auto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="h-11 md:h-auto" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Téléphone
                </FormLabel>
                <FormControl>
                  <Input type="tel" {...field} className="h-11 md:h-auto" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 md:pt-6">
            <Button
              type="submit"
              className="w-full h-12 md:h-auto text-base md:text-sm"
            >
              Continuer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
