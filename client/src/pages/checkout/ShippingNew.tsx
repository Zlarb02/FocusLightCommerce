import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckout } from "@/hooks/useCheckout";
import { Customer } from "@shared/schema";
import { OfficialMRWidget } from "@/components/OfficialMRWidget";
import { MapPin, Package } from "lucide-react";

export interface RelayPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  openingHours: string;
}

interface ShippingProps {
  onNext: () => void;
  onBack: () => void;
}

export function Shipping({ onNext, onBack }: ShippingProps) {
  const { customer, updateCustomer } = useCheckout();
  const [selectedRelayPoint, setSelectedRelayPoint] =
    useState<RelayPoint | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");

  const handleRelayPointSelect = (relayPointData: any) => {
    // Adapter les données du widget officiel vers notre format
    const relayPoint: RelayPoint = {
      id: relayPointData.id || relayPointData.ID,
      name: relayPointData.name || relayPointData.Name,
      address: relayPointData.address || relayPointData.Address,
      city: relayPointData.city || relayPointData.City,
      postalCode: relayPointData.postalCode || relayPointData.PostCode,
      distance: relayPointData.distance || 0,
      openingHours: relayPointData.openingHours || "",
    };

    setSelectedRelayPoint(relayPoint);
  };

  const handleSubmit = () => {
    if (selectedRelayPoint) {
      updateCustomer({
        deliveryMethod: "relay",
        relayPoint: selectedRelayPoint,
        address: selectedRelayPoint.address,
        postalCode: selectedRelayPoint.postalCode,
        city: selectedRelayPoint.city,
        country: "FR",
      } as Partial<Customer>);

      onNext();
    }
  };

  const handleSearch = () => {
    if (postalCode.trim()) {
      // Mettre à jour le customer avec le code postal saisi
      updateCustomer({
        postalCode: postalCode,
      } as Partial<Customer>);
    }
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-6">
        Livraison Mondial Relay
      </h2>

      {/* Information sur le mode de livraison */}
      <div className="border rounded-lg p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              Point Relais Mondial Relay
            </h3>
            <p className="text-gray-600">
              Livraison gratuite en 2-4 jours ouvrés • Disponible 14 jours •
              Horaires étendus
            </p>
          </div>
          <div className="ml-auto">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Gratuit
            </span>
          </div>
        </div>
      </div>

      {/* Champ de saisie du code postal */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Entrez votre code postal</h3>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="postalCode" className="sr-only">
              Code Postal
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="Votre code postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full"
            />
          </div>
          <Button
            variant="default"
            className="flex-shrink-0"
            onClick={handleSearch}
          >
            Rechercher
          </Button>
        </div>
      </div>

      {/* Sélection du point relais */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Choisissez votre point relais</h3>
        </div>

        {postalCode ? (
          <OfficialMRWidget
            postalCode={postalCode}
            onSelect={handleRelayPointSelect}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Veuillez entrer votre code postal ci-dessus</p>
            <p className="text-sm">
              puis cliquer sur "Rechercher" pour afficher la carte
            </p>
          </div>
        )}
      </div>

      {/* Point relais sélectionné */}
      {selectedRelayPoint && (
        <div className="border rounded-lg p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full mt-1">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800">
                {selectedRelayPoint.name}
              </h4>
              <p className="text-green-700 text-sm">
                {selectedRelayPoint.address}
              </p>
              <p className="text-green-700 text-sm">
                {selectedRelayPoint.postalCode} {selectedRelayPoint.city}
              </p>
              {selectedRelayPoint.distance > 0 && (
                <p className="text-green-600 text-xs mt-1">
                  À {selectedRelayPoint.distance.toFixed(1)} km
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="pt-4 flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-1/3"
          onClick={onBack}
        >
          Retour
        </Button>
        <Button
          type="button"
          className="w-2/3"
          disabled={!selectedRelayPoint}
          onClick={handleSubmit}
        >
          {selectedRelayPoint ? "Continuer" : "Sélectionnez un point relais"}
        </Button>
      </div>
    </div>
  );
}
