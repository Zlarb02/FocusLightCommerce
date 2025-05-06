import DashboardLayout from "./DashboardLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Save, Image, Trash2, Plus, Star } from "lucide-react";

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, "Le titre est requis"),
  heroSubtitle: z.string().min(1, "Le sous-titre est requis"),
  featuresTitle: z.string().min(1, "Le titre est requis"),
  featuresDescription: z.string().min(1, "La description est requise"),
  testimonialsTitle: z.string().min(1, "Le titre est requis"),
});

const socialLinksSchema = z.object({
  facebook: z.string().url("L'URL n'est pas valide").or(z.string().length(0)),
  instagram: z.string().url("L'URL n'est pas valide").or(z.string().length(0)),
  twitter: z.string().url("L'URL n'est pas valide").or(z.string().length(0)),
  linkedin: z.string().url("L'URL n'est pas valide").or(z.string().length(0)),
});

type HomeContentFormValues = z.infer<typeof homeContentSchema>;
type SocialLinksFormValues = z.infer<typeof socialLinksSchema>;

export default function Contenu() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("home");
  const [bannerImages, setBannerImages] = useState([
    {
      id: 1,
      title: "Bannière principale",
      path: "/src/assets/images/banner1.jpg",
    },
    {
      id: 2,
      title: "Bannière produits",
      path: "/src/assets/images/banner2.jpg",
    },
  ]);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Marie T.",
      role: "Architecte d'intérieur",
      content:
        "Design épuré et matériaux de qualité. La lampe FOCUS.01 de Alto sublime parfaitement mon bureau et crée une ambiance de travail idéale.",
      avatar: "",
      rating: 5,
    },
    {
      id: 2,
      name: "Pierre L.",
      role: "Designer",
      content:
        "J'adore le concept éco-responsable allié à un design minimaliste. La version bleue de la FOCUS.01 apporte une touche de couleur subtile à mon salon.",
      avatar: "",
      rating: 5,
    },
    {
      id: 3,
      name: "Sophie C.",
      role: "Décoratrice",
      content:
        "Livraison rapide et emballage soigné. La lampe est encore plus belle en vrai que sur les photos. Un achat que je ne regrette pas !",
      avatar: "",
      rating: 4,
    },
  ]);

  const homeContentForm = useForm<HomeContentFormValues>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: {
      heroTitle: "Alto",
      heroSubtitle:
        "Lampe d'appoint FOCUS.01 éco-responsable aux lignes épurées, conçue par Anatole Collet",
      featuresTitle: "Conception & Détails",
      featuresDescription:
        "Découvrez les caractéristiques uniques qui font de FOCUS.01 un choix durable et élégant pour votre intérieur.",
      testimonialsTitle: "Ce qu'en disent nos clients",
    },
  });

  const socialLinksForm = useForm<SocialLinksFormValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: "",
      instagram: "À venir",
      twitter: "",
      linkedin: "",
    },
  });

  const onSubmitHomeContent = (data: HomeContentFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Contenu mis à jour",
      description:
        "Le contenu de la page d'accueil a été mis à jour avec succès.",
    });
  };

  const onSubmitSocialLinks = (data: SocialLinksFormValues) => {
    // Dans un environnement réel, envoyez ces données à l'API
    toast({
      title: "Liens sociaux mis à jour",
      description: "Les liens sociaux ont été mis à jour avec succès.",
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageId?: number
  ) => {
    // Simuler l'upload d'image
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Image téléchargée",
        description: `L'image ${file.name} a été téléchargée avec succès.`,
      });

      // Si c'est une mise à jour d'une image existante
      if (imageId) {
        setBannerImages(
          bannerImages.map((img) =>
            img.id === imageId
              ? { ...img, path: URL.createObjectURL(file) }
              : img
          )
        );
      }
    }
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
    toast({
      title: "Témoignage supprimé",
      description: "Le témoignage a été supprimé avec succès.",
    });
  };

  const addTestimonial = () => {
    const newId = Math.max(...testimonials.map((t) => t.id), 0) + 1;
    setTestimonials([
      ...testimonials,
      {
        id: newId,
        name: "Nouveau client",
        role: "Profession",
        content: "Témoignage du client...",
        avatar: "",
        rating: 5,
      },
    ]);
    toast({
      title: "Témoignage ajouté",
      description: "Un nouveau témoignage a été ajouté. Modifiez son contenu.",
    });
  };

  return (
    <DashboardLayout title="Gestion du contenu">
      <Tabs
        defaultValue="home"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="home">Page d'accueil</TabsTrigger>
          <TabsTrigger value="banners">Bannières</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        </TabsList>

        {/* Page d'accueil */}
        <TabsContent value="home">
          <Card>
            <CardContent className="pt-6">
              <Form {...homeContentForm}>
                <form
                  onSubmit={homeContentForm.handleSubmit(onSubmitHomeContent)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-2">Section Hero</h3>
                    <FormField
                      control={homeContentForm.control}
                      name="heroTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre principal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={homeContentForm.control}
                      name="heroSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sous-titre</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-2">
                      Section Caractéristiques
                    </h3>
                    <FormField
                      control={homeContentForm.control}
                      name="featuresTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={homeContentForm.control}
                      name="featuresDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-2">
                      Section Témoignages
                    </h3>
                    <FormField
                      control={homeContentForm.control}
                      name="testimonialsTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="mt-6">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les
                    modifications
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bannières */}
        <TabsContent value="banners">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="font-medium text-lg">Images de bannières</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bannerImages.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-slate-100 h-48 flex items-center justify-center overflow-hidden">
                      <img
                        src={image.path}
                        alt={image.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">{image.title}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <label>
                            <Image className="mr-2 h-4 w-4" />
                            Changer l'image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, image.id)}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Témoignages */}
        <TabsContent value="testimonials">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Témoignages clients</h3>
                <Button onClick={addTestimonial} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="font-medium text-sm">
                              {testimonial.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <Input
                            value={testimonial.name}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              const index = newTestimonials.findIndex(
                                (t) => t.id === testimonial.id
                              );
                              newTestimonials[index].name = e.target.value;
                              setTestimonials(newTestimonials);
                            }}
                            className="text-sm font-medium mb-1 h-8"
                          />
                          <Input
                            value={testimonial.role}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              const index = newTestimonials.findIndex(
                                (t) => t.id === testimonial.id
                              );
                              newTestimonials[index].role = e.target.value;
                              setTestimonials(newTestimonials);
                            }}
                            className="text-xs text-muted-foreground h-6"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            className="p-0 w-6 h-6"
                            onClick={() => {
                              const newTestimonials = [...testimonials];
                              const index = newTestimonials.findIndex(
                                (t) => t.id === testimonial.id
                              );
                              newTestimonials[index].rating = rating;
                              setTestimonials(newTestimonials);
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                rating <= testimonial.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const newTestimonials = [...testimonials];
                          const index = newTestimonials.findIndex(
                            (t) => t.id === testimonial.id
                          );
                          newTestimonials[index].content = e.target.value;
                          setTestimonials(newTestimonials);
                        }}
                        className="resize-none h-24"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          toast({
                            title: "Témoignage mis à jour",
                            description:
                              "Les modifications ont été enregistrées.",
                          });
                        }}
                      >
                        <Save className="h-3 w-3 mr-1" /> Enregistrer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Réseaux sociaux */}
        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <Form {...socialLinksForm}>
                <form
                  onSubmit={socialLinksForm.handleSubmit(onSubmitSocialLinks)}
                  className="space-y-4"
                >
                  <FormField
                    control={socialLinksForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="À venir" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-2">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
