import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DynamicImage } from "@/components/DynamicImage";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Lightbulb,
  Users,
  Leaf,
} from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section avec photo */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              {/* Photo d'Anatole */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <DynamicImage
                    illustrationKey="about.anatole"
                    fallbackSrc="https://www.alto-lille.fr/uploads/6d140285-f1c2-4a80-bfde-d9848a4c5f92.jpg"
                    fallbackAlt="Anatole Collet - Fondateur d'Alto Lille"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t("about.hero.title")}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                {t("about.hero.subtitle")}
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-8">
                <Heart className="h-5 w-5 fill-current" />
                <span className="text-gray-600 dark:text-gray-300">
                  {t("about.hero.passion")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section présentation personnelle */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                {t("about.story.title")}
              </h2>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {t("about.story.intro")}
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {t("about.story.beginning")}
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {t("about.story.philosophy")}
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t("about.story.future")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section valeurs */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t("about.values.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("about.values.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Créativité */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("about.values.creativity.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("about.values.creativity.description")}
                </p>
              </div>

              {/* Durabilité */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("about.values.sustainability.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("about.values.sustainability.description")}
                </p>
              </div>

              {/* Proximité */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("about.values.proximity.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("about.values.proximity.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section atelier */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {t("about.workshop.title")}
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                <span className="text-xl font-medium text-gray-900 dark:text-white">
                  Lille, France
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {t("about.workshop.description")}
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic">
                {t("about.workshop.quote")}
              </p>
            </div>
          </div>
        </section>

        {/* Section contact */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t("about.contact.title")}
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              {t("about.contact.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 group"
                onClick={() =>
                  (window.location.href = "mailto:altolille@gmail.com")
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("about.contact.email")}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber-600 bg-transparent group"
                onClick={() => (window.location.href = "tel:+33782086690")}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("about.contact.phone")}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-amber-500/30">
              <p className="text-amber-100 text-sm">
                {t("about.contact.availability")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
