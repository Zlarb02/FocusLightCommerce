import { Layout } from "@/components/Layout";
import { Truck, Package, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Delivery() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Livraison
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toutes les informations sur nos options de livraison, délais et
              tarifs.
            </p>
          </div>

          {/* Options de livraison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Livraison Standard</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <Clock className="h-4 w-4 inline mr-2" />
                  3-5 jours ouvrés
                </p>
                <p className="text-gray-600">
                  <Package className="h-4 w-4 inline mr-2" />
                  Gratuite dès 50€ d'achat
                </p>
                <p className="text-lg font-semibold text-primary">4,90€</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Livraison Express</h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <Clock className="h-4 w-4 inline mr-2" />
                  24-48h ouvrées
                </p>
                <p className="text-gray-600">
                  <Package className="h-4 w-4 inline mr-2" />
                  Suivi en temps réel
                </p>
                <p className="text-lg font-semibold text-primary">9,90€</p>
              </div>
            </div>
          </div>

          {/* Zones de livraison */}
          <div className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "var(--font-titles)" }}
            >
              Zones de livraison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">France Métropolitaine</h4>
                <p className="text-gray-600 text-sm">
                  Livraison standard et express disponibles
                </p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Union Européenne</h4>
                <p className="text-gray-600 text-sm">
                  Livraison standard uniquement
                </p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Mondial</h4>
                <p className="text-gray-600 text-sm">
                  Sur devis - nous contacter
                </p>
              </div>
            </div>
          </div>

          {/* Informations importantes */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h3 className="text-xl font-semibold mb-4">
              Informations importantes
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Les délais de livraison sont donnés à titre indicatif et peuvent
                varier selon la destination.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Vos commandes sont expédiées depuis notre atelier à Lille.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Un email de confirmation avec le numéro de suivi vous sera
                envoyé dès l'expédition.
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Toutes nos lampes sont soigneusement emballées pour garantir
                leur intégrité.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">
              Des questions sur la livraison ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:altolille@gmail.com"
                className="flex items-center text-primary hover:underline"
              >
                <Mail className="h-4 w-4 mr-2" />
                altolille@gmail.com
              </a>
              <a
                href="tel:+33782086690"
                className="flex items-center text-primary hover:underline"
              >
                <Phone className="h-4 w-4 mr-2" />
                +33 782 086 690
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" className="mr-4">
                Continuer mes achats
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline">FAQ</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
