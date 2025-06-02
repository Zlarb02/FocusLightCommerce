import { useEffect, useRef } from "react";
import type { RelayPoint } from "@/pages/checkout/ShippingNew";

interface OfficialMRWidgetProps {
  postalCode: string;
  onSelect: (point: any) => void;
}

declare global {
  interface Window {
    $?: any;
    jQuery?: any;
  }
}

export function OfficialMRWidget({
  postalCode,
  onSelect,
}: OfficialMRWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!postalCode.trim()) return;

    // Charger jQuery si pas déjà présent
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }
        
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href: string): void => {
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) return;
      
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    const initWidget = async () => {
      try {
        // Charger les dépendances en mode démo/test
        await loadScript("//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js");
        await loadScript("//unpkg.com/leaflet/dist/leaflet.js");
        loadCSS("//unpkg.com/leaflet/dist/leaflet.css");
        await loadScript("https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js");

        // Attendre un peu pour que jQuery soit disponible
        await new Promise(resolve => setTimeout(resolve, 100));

        if (window.$ && containerRef.current && hiddenInputRef.current) {
          const $ = window.$;
          
          // Nettoyer le conteneur
          $(containerRef.current).empty();
          
          // Initialiser le widget avec un Brand de test
          $(containerRef.current).MR_ParcelShopPicker({
            Target: hiddenInputRef.current,
            Brand: "BDTEST", // Code de test - peut être remplacé par TEST1234 si nécessaire
            Country: "FR",
            PostCode: postalCode,
            Theme: "mondialrelay",
            Responsive: true,
            ShowResultsOnMap: true,
            ShowOpeningHours: true,
            ShowDistance: true,
            OrderBy: "Distance",
            CallBack: function(data: any) {
              // Convertir les données du callback vers notre format
              if (data && data.ID) {
                const relayPoint = {
                  id: data.ID,
                  name: data.LgAdr1 || data.Nom || `Point Relais ${data.ID}`,
                  address: `${data.LgAdr3 || ''} ${data.LgAdr4 || ''}`.trim() || data.LgAdr1 || '',
                  city: data.Ville || '',
                  postalCode: data.CP || postalCode,
                  distance: parseFloat(data.Distance) || 0,
                  openingHours: data.Horaires_Lundi || '',
                  // Ajouter des propriétés supplémentaires si disponibles
                  latitude: data.Latitude || 0,
                  longitude: data.Longitude || 0,
                  phone: data.Tel || '',
                  email: data.Mail || ''
                };
                
                console.log("Point relais sélectionné:", relayPoint);
                onSelect(relayPoint);
              }
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du widget Mondial Relay:", error);
        
        // Afficher un message d'erreur informatif
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div class="text-gray-500 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-700 mb-1">Widget temporairement indisponible</h3>
              <p class="text-sm text-gray-600 mb-4">
                Le widget Mondial Relay est en cours de chargement ou temporairement indisponible.
              </p>
              <p class="text-xs text-gray-500">
                Code postal recherché: ${postalCode}
              </p>
            </div>
          `;
        }
      }
    };

    initWidget();

    // Cleanup function
    return () => {
      if (containerRef.current && window.$) {
        try {
          window.$(containerRef.current).empty();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [postalCode, onSelect]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full h-[400px] min-h-[400px]" />
      <input 
        ref={hiddenInputRef} 
        type="hidden" 
        id="Retour_Widget" 
        className="sr-only"
      />
    </div>
  );
}
