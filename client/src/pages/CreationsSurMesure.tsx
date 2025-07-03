import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, Star } from "lucide-react";

export default function CreationsSurMesure() {
  const { t } = useLanguage();

  const customCreations = [
    {
      id: "applique-murale",
      title: "Applique Murale Moderne",
      description:
        "Applique murale sur mesure avec éclairage LED indirect, créée pour un projet d'architecture d'intérieur contemporain.",
      image: "/images/blanche.png", // Placeholder
      features: [
        "Design épuré et minimaliste",
        "Éclairage LED dimmable",
        "Installation murale discrète",
        "Matériaux premium (chêne + aluminium)",
      ],
      specs:
        "Dimensions : 40x20x15cm • Puissance : 15W LED • Température : 2700K-4000K",
      price: "Sur devis",
    },
    {
      id: "lampe-bras-articule",
      title: "Lampe à Bras Articulé",
      description:
        "Luminaire mural avec bras articulé pour un espace de travail, offrant une flexibilité maximale d'éclairage.",
      image: "/images/orange.png", // Placeholder
      features: [
        "Bras articulé 360°",
        "Tête orientable",
        "Intensité variable",
        "Finition bois massif",
      ],
      specs:
        "Portée : 80cm • Rotation : 360° • Puissance : 12W LED • Gradation tactile",
      price: "Sur devis",
    },
    {
      id: "lampadaire-design",
      title: "Lampadaire Design Contemporain",
      description:
        "Lampadaire sur mesure alliant esthétique moderne et fonctionnalité, créé pour un salon d'entreprise.",
      image: "/images/bleue.png", // Placeholder
      features: [
        "Hauteur ajustable",
        "Double éclairage (direct/indirect)",
        "Base lestée stable",
        "Interrupteur au pied",
      ],
      specs:
        "Hauteur : 150-180cm • Double flux LED • Base Ø30cm • Finition naturelle",
      price: "Sur devis",
    },
    {
      id: "lampadaire-sculptural",
      title: "Lampadaire Sculptural",
      description:
        "Pièce unique sculptée dans du chêne massif, fusionnant art et éclairage pour un hall d'accueil.",
      image: "/images/rouge.png", // Placeholder
      features: [
        "Sculpture sur bois unique",
        "Éclairage intégré invisible",
        "Essence de chêne français",
        "Vernis écologique",
      ],
      specs:
        "Hauteur : 200cm • Éclairage ambiant 360° • Socle intégré • Pièce unique",
      price: "Sur devis",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Consultation",
      description: "Échange sur vos besoins, contraintes et vision esthétique",
    },
    {
      step: "2",
      title: "Conception",
      description: "Création de croquis et modélisation 3D de votre projet",
    },
    {
      step: "3",
      title: "Validation",
      description: "Ajustements et validation du design final avec devis",
    },
    {
      step: "4",
      title: "Réalisation",
      description: "Fabrication artisanale avec suivi régulier d'avancement",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Créations à la{" "}
                <span className="text-amber-600 dark:text-amber-400">
                  Demande
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Des luminaires uniques conçus spécialement pour vos projets
                d'architecture et d'aménagement
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  Créations 100% sur mesure
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Réalisations Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Nos Réalisations Spéciales
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Découvrez quelques-unes de nos créations sur mesure réalisées
                pour des clients exigeants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {customCreations.map((creation) => (
                <div
                  key={creation.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={creation.image}
                      alt={creation.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {creation.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {creation.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {creation.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {creation.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Specs */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        SPÉCIFICATIONS
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {creation.specs}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Notre Processus de Création
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                De l'idée à la réalisation, nous vous accompagnons à chaque
                étape
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={item.step} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-amber-200 dark:bg-amber-800 -ml-8" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Un projet d'éclairage sur mesure ?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour discuter de votre projet et recevoir un devis
              personnalisé. Chaque création est unique et adaptée à vos besoins
              spécifiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 group"
                onClick={() =>
                  (window.location.href =
                    "mailto:altolille@gmail.com?subject=Demande de devis - Création sur mesure")
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Demander un devis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber-600 group"
                onClick={() => (window.location.href = "tel:+33782086690")}
              >
                <Phone className="mr-2 h-4 w-4" />
                +33 7 82 08 66 90
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-amber-500/30">
              <p className="text-amber-100 text-sm">
                <strong>Délai de réalisation :</strong> 3 à 6 semaines selon la
                complexité du projet
                <br />
                <strong>Garantie :</strong> 2 ans sur tous nos luminaires sur
                mesure
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
