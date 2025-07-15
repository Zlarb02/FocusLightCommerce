import React, { useState, useEffect, useRef } from "react";
import { ParcelShopSelector } from "@frontboi/mondial-relay/browser";
import {
  MapPin,
  Package,
  Clock,
  Star,
  CheckCircle2,
  Navigation,
  Phone,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import "./MondialRelayWidget.css";

interface SelectedParcelShop {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  openingHours?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

interface MondialRelayWidgetProps {
  postalCode: string;
  weight?: number; // en grammes
  onParcelShopSelected: (shop: SelectedParcelShop | null) => void;
  className?: string;
}

export const MondialRelayWidget: React.FC<MondialRelayWidgetProps> = ({
  postalCode,
  weight = 1000,
  onParcelShopSelected,
  className = "",
}) => {
  const [selectedShop, setSelectedShop] = useState<SelectedParcelShop | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Configuration pour les tests
  const config = {
    weight,
    nbResults: 10,
    deliveryMode: "24R" as const,
    brandIdAPI: "CC23KB4N",
    defaultCountry: "FR",
    defaultPostcode: postalCode,
    allowedCountries: "FR,BE,ES,IT,LU,NL,PT",
  };

  const handleParcelShopSelected = (shop: any) => {
    console.log("🎯 Point relais sélectionné - Structure complète:", shop);
    console.log("🔍 Clés disponibles:", Object.keys(shop || {}));

    if (shop) {
      // Mapping corrigé selon la structure réelle de l'API Mondial Relay
      const formattedShop: SelectedParcelShop = {
        id: shop.ID || shop.Num || shop.id || shop.code || "",
        name:
          shop.Nom ||
          shop.LgAdr1 ||
          shop.name ||
          shop.nom ||
          shop.designation ||
          "",
        address:
          shop.Adresse1 ||
          shop.LgAdr3 ||
          shop.LgAdr4 ||
          shop.address ||
          shop.adresse ||
          `${shop.Adresse1 || ""} ${shop.Adresse2 || ""}`.trim() ||
          "",
        city: shop.Ville || shop.city || shop.ville || "",
        postalCode: shop.CP || shop.postalCode || shop.codePostal || "",
        country: shop.Pays || shop.country || shop.countryCode || "FR",
        openingHours:
          shop.HoursHtmlTable ||
          shop.Horaires_Lundi ||
          shop.openingHours ||
          shop.horaires ||
          "",
        distance: shop.Distance
          ? parseFloat(shop.Distance)
          : shop.distance
          ? parseFloat(shop.distance)
          : undefined,
        latitude: shop.Lat
          ? parseFloat(shop.Lat)
          : shop.Latitude
          ? parseFloat(shop.Latitude)
          : shop.latitude
          ? parseFloat(shop.latitude)
          : shop.lat
          ? parseFloat(shop.lat)
          : undefined,
        longitude: shop.Long
          ? parseFloat(shop.Long)
          : shop.Longitude
          ? parseFloat(shop.Longitude)
          : shop.longitude
          ? parseFloat(shop.longitude)
          : shop.lng
          ? parseFloat(shop.lng)
          : undefined,
      };

      console.log("✅ Point relais formaté:", formattedShop);
      setSelectedShop(formattedShop);
      onParcelShopSelected(formattedShop);
      setError(null);
    } else {
      setSelectedShop(null);
      onParcelShopSelected(null);
    }
  };

  const resetSelection = () => {
    setSelectedShop(null);
    onParcelShopSelected(null);
  };

  return (
    <div className={`relative mondial-relay-widget ${className}`}>
      <AnimatePresence mode="wait">
        {selectedShop ? (
          /* Point relais sélectionné - Affichage de confirmation */
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Carte principale du point relais sélectionné */}
            <div className="relay-confirmation-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm hover-card">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl animated-icon">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {selectedShop.name}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {selectedShop.address}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedShop.postalCode} {selectedShop.city}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    {selectedShop.distance && (
                      <div className="flex items-center gap-1">
                        <Navigation className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          À {selectedShop.distance.toFixed(1)} km
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Livraison 2-3 jours
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSelection}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>

            {/* Informations compactes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover-card">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 animated-icon" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      Votre colis
                    </h5>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {weight}g • Retrait gratuit
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 hover-card">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 animated-icon" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      Avantages
                    </h5>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Horaires étendus • Sécurisé
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Widget de sélection simple */
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Widget Mondial Relay */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="relative min-h-[450px]">
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
                    <div className="text-center p-6">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Erreur de chargement
                      </p>
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-3"
                      >
                        Réessayer
                      </Button>
                    </div>
                  </div>
                )}

                <ParcelShopSelector
                  {...config}
                  onParcelShopSelected={handleParcelShopSelected}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MondialRelayWidget;
