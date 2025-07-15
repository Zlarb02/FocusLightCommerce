import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Package,
  Star,
  Phone,
  Navigation,
  ArrowRight,
  CheckCircle2,
  Edit,
  Truck,
  Shield,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RelayPointDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  openingHours?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

interface RelayPointCardProps {
  relayPoint: RelayPointDetails;
  onEdit: () => void;
  className?: string;
}

export const RelayPointCard: React.FC<RelayPointCardProps> = ({
  relayPoint,
  onEdit,
  className = "",
}) => {
  // Parse les horaires si disponibles
  const parseOpeningHours = (hours?: string) => {
    if (!hours) return null;

    // Exemple de format attendu: "Lun-Ven: 08h00-19h30, Sam: 08h00-12h30"
    // Pour l'instant, on affiche tel quel, mais on pourrait parser plus finement
    return hours;
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(
      `${relayPoint.name} ${relayPoint.address} ${relayPoint.city}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full", className)}
    >
      <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Point relais confirmé
                </CardTitle>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Votre colis sera livré ici
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-800/30"
            >
              <Edit className="w-4 h-4 mr-1" />
              Modifier
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informations principales */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              {relayPoint.name}
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {relayPoint.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {relayPoint.postalCode} {relayPoint.city}
                  </p>
                </div>
              </div>

              {relayPoint.distance && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    À {formatDistance(relayPoint.distance)} de votre recherche
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Horaires et services */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Horaires */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Horaires
              </h5>
              {parseOpeningHours(relayPoint.openingHours) ? (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {parseOpeningHours(relayPoint.openingHours)}
                </p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Voir sur place ou appeler
                </p>
              )}
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                Services
              </h5>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Retrait sécurisé</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-blue-500" />
                  <span>Gratuit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions et informations complémentaires */}
          <div className="space-y-3">
            {/* Bouton Google Maps */}
            <Button
              variant="outline"
              onClick={() => window.open(getGoogleMapsUrl(), "_blank")}
              className="w-full justify-center border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Voir l'itinéraire sur Google Maps
            </Button>

            {/* Informations de retrait */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Important pour le retrait
              </h5>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <p>• Munissez-vous d'une pièce d'identité</p>
                <p>• Vous recevrez un SMS/email avec le code de retrait</p>
                <p>• Délai de conservation : 14 jours</p>
              </div>
            </div>

            {/* Délai de livraison estimé */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
                  <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100 text-sm">
                    Livraison estimée
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    2-3 jours ouvrés après expédition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
