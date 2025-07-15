import { Router, Request, Response } from "express";

const router = Router();

// Configuration from env variables
const MR_CONFIG = {
  brandIdAPI: process.env.MONDIAL_RELAY_V2_BRAND_ID || "BDTEST",
  defaultCountry: "FR",
  allowedCountries: "FR,BE",
};

console.log("✅ Configuration Mondial Relay chargée:", MR_CONFIG);

/**
 * Test simple pour vérifier la configuration
 */
const testConnectionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🧪 Test configuration Mondial Relay...");

    res.json({
      success: true,
      message: "Configuration Mondial Relay chargée",
      config: MR_CONFIG,
      info: {
        note: "La librairie @frontboi/mondial-relay est principalement orientée frontend.",
        frontend_usage: {
          component: "ParcelShopSelector",
          props: {
            weight: 3000,
            nbResults: 7,
            deliveryMode: "24R",
            brandIdAPI: MR_CONFIG.brandIdAPI,
            defaultCountry: "FR",
            allowedCountries: "FR,BE",
          },
        },
        next_steps: "Implémenter l'API REST directe pour le backend",
      },
    });
  } catch (error) {
    console.error("❌ Erreur test:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du test",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

/**
 * Endpoint temporaire pour la recherche de points relais
 * TODO: Implémenter l'API REST directe de Mondial Relay v2
 */
const searchPickupPointsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      postalCode,
      countryCode = "FR",
      weight = 3000,
      nbResults = 7,
    } = req.query;

    if (!postalCode || typeof postalCode !== "string") {
      res.status(400).json({
        success: false,
        error: "Le code postal est requis",
      });
      return;
    }

    console.log(
      `🔍 Recherche points relais pour: ${postalCode}, ${countryCode}`
    );

    // Paramètres validés selon votre exemple ParcelShopSelector
    const searchParams = {
      weight: Number(weight),
      nbResults: Number(nbResults),
      deliveryMode: "24R",
      brandIdAPI: MR_CONFIG.brandIdAPI,
      defaultCountry: countryCode,
      defaultPostcode: postalCode,
      allowedCountries: MR_CONFIG.allowedCountries,
    };

    res.json({
      success: true,
      message: "Paramètres validés - API en cours d'implémentation",
      searchParams,
      status: "TODO: Appel API REST Mondial Relay v2",
      frontend_component: {
        library: "@frontboi/mondial-relay/browser",
        component: "ParcelShopSelector",
        props: searchParams,
      },
    });
  } catch (error) {
    console.error("❌ Erreur recherche points relais:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la recherche des points relais",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

/**
 * Endpoint temporaire pour le calcul de prix
 * TODO: Implémenter l'API REST directe de Mondial Relay v2
 */
const getDeliveryPriceHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { weight, countryCode = "FR" } = req.query;

    if (!weight || isNaN(Number(weight))) {
      res.status(400).json({
        success: false,
        error: "Le poids en grammes est requis",
      });
      return;
    }

    console.log(
      `💰 Calcul prix livraison pour: ${weight}g vers ${countryCode}`
    );

    res.json({
      success: true,
      message: "Paramètres validés - Calcul de prix en cours d'implémentation",
      params: {
        weight: Number(weight),
        countryCode,
        brandIdAPI: MR_CONFIG.brandIdAPI,
      },
      status: "TODO: Appel API REST Mondial Relay v2 pour le calcul de prix",
    });
  } catch (error) {
    console.error("❌ Erreur calcul prix:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du calcul du prix",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Routes
router.get("/test", testConnectionHandler);
router.get("/pickup-points", searchPickupPointsHandler);
router.get("/delivery-price", getDeliveryPriceHandler);

export default router;
