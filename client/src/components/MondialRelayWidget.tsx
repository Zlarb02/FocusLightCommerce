import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Truck } from "lucide-react";

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: number;
  openingHours: string;
}

interface MondialRelayWidgetProps {
  onSelectRelayPoint: (relayPoint: RelayPoint) => void;
  selectedRelayPoint?: RelayPoint | null;
  customerPostalCode?: string;
}

export function MondialRelayWidget({
  onSelectRelayPoint,
  selectedRelayPoint,
  customerPostalCode = "59000",
}: MondialRelayWidgetProps) {
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode);
  const mapRef = useRef<HTMLDivElement>(null);

  // Données simulées des points relais Mondial Relay
  const mockRelayPoints: RelayPoint[] = [
    {
      id: "MR001",
      name: "Relay Shop Lille Centre",
      address: "12 Rue de la République",
      city: "Lille",
      postalCode: "59000",
      distance: 0.5,
      openingHours: "Lun-Ven: 9h-19h, Sam: 9h-18h",
    },
    {
      id: "MR002",
      name: "Tabac Presse Wazemmes",
      address: "45 Rue Gambetta",
      city: "Lille",
      postalCode: "59000",
      distance: 1.2,
      openingHours: "Lun-Sam: 8h-20h, Dim: 9h-13h",
    },
    {
      id: "MR003",
      name: "Pharmacie du Vieux Lille",
      address: "8 Place aux Oignons",
      city: "Lille",
      postalCode: "59000",
      distance: 1.8,
      openingHours: "Lun-Ven: 9h-19h30, Sam: 9h-19h",
    },
    {
      id: "MR004",
      name: "Super U Gambetta",
      address: "156 Rue Gambetta",
      city: "Lille",
      postalCode: "59000",
      distance: 2.1,
      openingHours: "Lun-Sam: 8h30-20h, Dim: 9h-13h",
    },
    {
      id: "MR005",
      name: "Boulangerie Patisserie Martin",
      address: "23 Avenue de la République",
      city: "Lille",
      postalCode: "59000",
      distance: 2.5,
      openingHours: "Mar-Sam: 7h-19h, Dim: 7h-13h",
    },
  ];

  const searchRelayPoints = async (postalCode: string) => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API Mondial Relay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // En production, ici vous feriez un vrai appel à l'API Mondial Relay
      // const response = await apiRequest('GET', `/api/mondial-relay/points?postalCode=${postalCode}`);

      setRelayPoints(mockRelayPoints);
    } catch (error) {
      console.error("Erreur lors de la recherche des points relais:", error);
      setRelayPoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchPostalCode) {
      searchRelayPoints(searchPostalCode);
    }
  }, [searchPostalCode]);

  const handleSelectRelayPoint = (relayPoint: RelayPoint) => {
    onSelectRelayPoint(relayPoint);
  };

  return (
    <div className="space-y-6">
      {/* Recherche par code postal */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Rechercher des points relais
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchPostalCode}
            onChange={(e) => setSearchPostalCode(e.target.value)}
            placeholder="Code postal"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={5}
          />
          <Button
            onClick={() => searchRelayPoints(searchPostalCode)}
            disabled={isLoading || !searchPostalCode}
            className="px-6"
          >
            {isLoading ? "..." : "Rechercher"}
          </Button>
        </div>
      </div>

      {/* Point relais sélectionné */}
      {selectedRelayPoint && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800">
                Point relais sélectionné
              </h4>
              <p className="text-sm text-green-700 font-medium">
                {selectedRelayPoint.name}
              </p>
              <p className="text-sm text-green-600">
                {selectedRelayPoint.address}, {selectedRelayPoint.city}
              </p>
              <p className="text-xs text-green-600">
                {selectedRelayPoint.openingHours}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des points relais */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Points relais disponibles
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-gray-500">Recherche en cours...</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {relayPoints.map((point) => {
              const isSelected = selectedRelayPoint?.id === point.id;

              return (
                <div
                  key={point.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectRelayPoint(point)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{point.name}</h4>
                      <p className="text-sm text-gray-600">{point.address}</p>
                      <p className="text-sm text-gray-600">
                        {point.postalCode} {point.city}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {point.openingHours}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {point.distance} km
                      </span>
                      {isSelected && (
                        <div className="mt-2">
                          <span className="text-xs text-primary font-medium">
                            ✓ Sélectionné
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Informations Mondial Relay */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">
              Livraison Mondial Relay
            </p>
            <p className="text-blue-700">
              • Livraison en 2-4 jours ouvrés
              <br />
              • Colis disponible pendant 14 jours
              <br />
              • Notification SMS à réception
              <br />• Livraison gratuite en France métropolitaine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
