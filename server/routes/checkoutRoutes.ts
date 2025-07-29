import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "../storage/index.js";
import { checkoutSchema } from "../../shared/schema.js";
import { handleError } from "../middleware/middlewares.js";
import { notificationService } from "../services/notificationService.js";
import path from "path";
import fs from "fs";

const router = Router();

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(
      "🔄 Début traitement commande:",
      JSON.stringify(req.body, null, 2)
    );

    const data = checkoutSchema.parse(req.body);
    console.log("✅ Validation schema réussie");

    let customer = await storage.getCustomerByEmail(data.customer.email);
    if (!customer) {
      console.log("🆕 Création nouveau client");
      customer = await storage.createCustomer(data.customer);
    } else {
      console.log("🔄 Mise à jour client existant");
      customer =
        (await storage.updateCustomer(customer.id, data.customer)) || customer;
    }
    console.log("✅ Client traité:", customer.id);

    // Préparer les données de point relais si disponible
    const relayPointData = data.customer.relayPoint
      ? JSON.stringify(data.customer.relayPoint)
      : null;
    console.log("📦 Point relais reçu:", data.customer.relayPoint);
    console.log("📦 Point relais stringifié:", relayPointData);

    console.log("🔄 Création commande...");
    const order = await storage.createOrder({
      customerId: customer.id,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      relayPoint: relayPointData,
      totalAmount: data.totalAmount,
      status: "pending",
    });
    console.log("✅ Commande créée:", order.id, order.orderNumber);

    // Créer les articles de commande et récupérer les détails produits pour l'email
    console.log("🔄 Traitement des articles:", data.items.length);
    const emailItems: Array<{
      productName: string;
      variationValue: string;
      quantity: number;
      price: number;
    }> = [];
    await Promise.all(
      data.items.map(async (item: any, index: number) => {
        console.log(`🔄 Traitement article ${index + 1}:`, item);

        // Récupérer les détails complets du produit pour l'email
        const product = await storage.getProductById(item.productId);
        console.log(
          `📦 Produit ${item.productId} trouvé:`,
          product ? "Oui" : "Non"
        );

        const variation = product?.variations?.find(
          (v) =>
            v.variationType === item.variationType &&
            v.variationValue === item.variationValue
        );
        console.log(`🎨 Variation trouvée:`, variation ? "Oui" : "Non");

        const productName = "FOCUS.01"; // Hard-codé car il n'y a qu'un seul produit
        const variationDisplay = item.variationValue || "";

        // Créer l'article en base
        console.log(`💾 Création order item pour commande ${order.id}`);
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: productName,
          variationType: item.variationType || null,
          variationValue: item.variationValue || null,
          quantity: item.quantity,
          unitPrice: item.price / 100, // Stocker en euros
          totalPrice: (item.price * item.quantity) / 100, // Stocker en euros
        });

        // Ajouter aux données pour l'email
        emailItems.push({
          productName: productName,
          variationValue: variationDisplay,
          quantity: item.quantity,
          price: item.price / 100, // Déjà converti, pas besoin de rediviser
        });

        // Mise à jour du stock de la variation
        if (variation) {
          console.log(`📉 Mise à jour stock pour produit ${item.productId}`);
          await storage.updateVariationStock(item.productId, -item.quantity);
        }
      })
    );
    console.log("✅ Tous les articles traités");

    // Envoi des notifications email avec facture
    try {
      console.log("📧 Données relayPoint pour email:", order.relayPoint);
      const invoice = await notificationService.sendOrderConfirmation({
        orderId: order.id, // Ajouter l'orderId manquant
        customerEmail: customer.email,
        customerPhone: customer.phone || "",
        customerName: `${customer.firstName} ${customer.lastName}`,
        orderNumber: order.orderNumber || `ALTO-${order.id}`,
        items: emailItems, // Utiliser les données enrichies
        totalAmount: order.totalAmount / 100, // Convertir centimes en euros,
        relayPoint: order.relayPoint
          ? {
              name: order.relayPoint.name || "",
              address: order.relayPoint.address || "",
              city: order.relayPoint.city || "",
              postalCode: order.relayPoint.postalCode || "",
            }
          : null,
      });

      console.log(
        `✅ Email envoyé et facture générée: ${invoice.invoiceNumber}`
      );
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // On continue même si l'email échoue
    }

    console.log("✅ Commande finalisée avec succès:", {
      orderId: order.id,
      orderNumber: order.orderNumber || `ALTO-${order.id}`,
      totalAmount: order.totalAmount,
    });

    res.status(201).json({
      orderId: order.id,
      orderNumber: order.orderNumber || `ALTO-${order.id}`,
      customer,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("❌ Erreur dans POST /api/checkout:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Pas de stack"
    );
    handleError(res, error);
  }
});

/**
 * Endpoint pour créer un Payment Intent Stripe
 * POST /api/checkout/create-payment-intent
 */
router.post(
  "/create-payment-intent",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency = "eur", metadata = {} } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Montant invalide" });
        return;
      }

      // Créer le Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Erreur création Payment Intent:", error);
      res.status(500).json({
        error: "Erreur lors de la création du Payment Intent",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
);

// Route pour récupérer les détails d'une commande et sa facture
router.get(
  "/order/:orderNumber",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderNumber } = req.params;
      console.log("🔍 Recherche commande:", orderNumber);

      // Rechercher la commande par numéro
      const order = await storage.getOrderByNumber(orderNumber);
      if (!order) {
        console.log("❌ Commande non trouvée:", orderNumber);
        res.status(404).json({ error: "Commande non trouvée" });
        return;
      }
      console.log("✅ Commande trouvée:", order.id);

      // Récupérer le client
      const customer = await storage.getCustomerById(order.customerId);
      if (!customer) {
        console.log("❌ Client non trouvé:", order.customerId);
        res.status(404).json({ error: "Client non trouvé" });
        return;
      }
      console.log("✅ Client trouvé:", customer.id);

      // Récupérer les articles de la commande avec les infos de produits
      const orderItems = await storage.getOrderItemsByOrderId(order.id);
      console.log("📦 Articles trouvés:", orderItems.length);

      // Enrichir les articles avec les informations complètes des produits et leurs images
      const enrichedItems = await Promise.all(
        orderItems.map(async (item) => {
          try {
            const product = await storage.getProductById(item.productId);
            let productImage = null;

            if (product) {
              // Trouver la variation correspondante par type et valeur
              if (
                item.variationType &&
                item.variationValue &&
                product.variations
              ) {
                const variation = product.variations.find(
                  (v) =>
                    v.variationType === item.variationType &&
                    v.variationValue === item.variationValue
                );
                if (
                  variation &&
                  variation.images &&
                  variation.images.length > 0
                ) {
                  // Prendre la première image de la variation
                  productImage = variation.images[0].url;
                }
              }
            }

            return {
              ...item,
              productImage,
              productName: product?.name || item.productName,
            };
          } catch (error) {
            console.error(
              `Erreur lors de l'enrichissement de l'article ${item.id}:`,
              error
            );
            return item;
          }
        })
      );

      // Chercher le fichier de facture
      const invoicesDir = path.join(process.cwd(), "invoices");
      let invoiceHTML = null;
      let invoiceNumber = null;

      if (fs.existsSync(invoicesDir)) {
        const invoiceFiles = fs
          .readdirSync(invoicesDir)
          .filter(
            (file) =>
              file.includes(orderNumber) || file.includes(order.id.toString())
          );

        if (invoiceFiles.length > 0) {
          const invoiceFile = invoiceFiles[0];
          invoiceNumber = invoiceFile.replace(".html", "");
          const invoicePath = path.join(invoicesDir, invoiceFile);
          invoiceHTML = fs.readFileSync(invoicePath, "utf8");
        }
      }

      const orderData = {
        id: order.id,
        orderNumber: order.orderNumber || `FC-${order.id}`,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        items: enrichedItems,
        invoice: {
          number: invoiceNumber,
          html: invoiceHTML,
        },
        // Ajouter les informations de point relais s'il y en a
        ...(order.relayPoint && {
          relayPoint: order.relayPoint, // Plus besoin de parser car c'est déjà fait dans mapRowToOrder
        }),
      };

      console.log(
        "📦 Point relais dans la commande récupérée:",
        order.relayPoint
      );
      console.log("📦 Point relais après parsing:", order.relayPoint);

      res.json(orderData);
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

export default router;
