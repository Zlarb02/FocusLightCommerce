// Service de notification simple - Email automatique + copie admin
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { invoiceService } from "./invoiceService.js";

interface OrderConfirmationData {
  orderId: number; // Ajouter l'orderId
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    variationValue: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  relayPoint: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
}

class NotificationService {
  private adminEmail = process.env.ADMIN_EMAIL || "altolille@gmail.com";
  private shopEmail = process.env.SHOP_EMAIL || "altolille@gmail.com";
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration du transporteur SMTP
    console.log("🔧 Configuration SMTP en cours...");
    console.log(`📧 SMTP Host: ${process.env.SMTP_HOST || "smtp.gmail.com"}`);
    console.log(`📧 SMTP Port: ${process.env.SMTP_PORT || "587"}`);
    console.log(`📧 SMTP User: ${process.env.SMTP_USER || this.shopEmail}`);
    console.log(
      `📧 SMTP Pass: ${process.env.SMTP_PASS ? "✅ Défini" : "❌ NON DÉFINI"}`
    );

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true pour port 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER || this.shopEmail,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("✅ Transporteur SMTP configuré");
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<{
    invoiceNumber: string;
    invoiceHTML: string;
  }> {
    try {
      console.log("� =============== DÉBUT ENVOI EMAIL ===============");
      console.log("�🔍 DEBUG - Données reçues dans sendOrderConfirmation:");
      console.log("  - customerEmail:", data.customerEmail);
      console.log("  - orderNumber:", data.orderNumber);
      console.log("  - relayPoint:", data.relayPoint);
      console.log(
        "  - relayPoint détails:",
        JSON.stringify(data.relayPoint, null, 2)
      );

      // 1. Générer uniquement le HTML de la facture (sans PDF)
      console.log("📄 Génération de la facture HTML uniquement (sans PDF)");
      const { invoiceNumber, invoiceHTML } =
        await invoiceService.generateInvoiceHTMLOnly(data);

      // 2. Email au client avec facture HTML uniquement
      await this.sendCustomerEmail(data, {
        invoiceNumber,
        invoiceHTML,
      });

      // 3. Email admin avec toutes les infos
      await this.sendAdminNotification(data, {
        invoiceNumber,
        invoiceHTML,
      });

      // 4. Log et sauvegarde pour backup
      this.logAndSaveOrder(data);

      return { invoiceNumber, invoiceHTML };
    } catch (error) {
      console.error("❌ =============== ERREUR EMAIL ===============");
      console.error("📧 Détails de l'erreur email:", error);
      if (error instanceof Error) {
        console.error("📧 Type d'erreur:", error.name);
        console.error("📧 Message d'erreur:", error.message);
        if ((error as any).code) {
          console.error("📧 Code d'erreur:", (error as any).code);
        }
      }
      console.error("❌ =============== FIN ERREUR ===============");
      throw error;
    }
  }

  private async sendCustomerEmail(
    data: OrderConfirmationData,
    invoice: { invoiceNumber: string; invoiceHTML: string }
  ): Promise<void> {
    const emailHtml = this.generateCustomerEmailHtml(data, invoice);

    try {
      const mailOptions = {
        from: this.shopEmail,
        to: data.customerEmail,
        subject: `Alto Lille — Commande ${data.orderNumber} confirmée · Facture ${invoice.invoiceNumber}`,
        html: emailHtml,
        attachments: [
          {
            filename: `facture-${invoice.invoiceNumber}.html`,
            content: invoice.invoiceHTML,
            contentType: "text/html",
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email client envoyé avec succès:`, info.messageId);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${data.customerEmail}`);
      console.log(
        `Sujet: Alto Lille — Commande ${data.orderNumber} confirmée · Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    } catch (error) {
      console.error("❌ Erreur envoi email client:", error);
      // En cas d'erreur, on log quand même les détails pour debug
      console.log(`📧 Email client (non envoyé):`);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${data.customerEmail}`);
      console.log(
        `Sujet: Alto Lille — Commande ${data.orderNumber} confirmée · Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    }
  }

  private async sendAdminNotification(
    data: OrderConfirmationData,
    invoice: { invoiceNumber: string; invoiceHTML: string }
  ): Promise<void> {
    const adminHtml = this.generateAdminEmailHtml(data, invoice);

    try {
      const mailOptions = {
        from: this.shopEmail,
        to: this.adminEmail,
        subject: `🔔 Nouvelle commande ${data.orderNumber} à préparer · Facture ${invoice.invoiceNumber}`,
        html: adminHtml,
        attachments: [
          {
            filename: `facture-${invoice.invoiceNumber}.html`,
            content: invoice.invoiceHTML,
            contentType: "text/html",
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Notification admin envoyée avec succès:`, info.messageId);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${this.adminEmail}`);
      console.log(
        `Sujet: 🔔 Nouvelle commande ${data.orderNumber} à préparer · Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    } catch (error) {
      console.error("❌ Erreur envoi email admin:", error);
      // En cas d'erreur, on log quand même les détails pour debug
      console.log(`📧 Notification admin (non envoyée):`);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${this.adminEmail}`);
      console.log(
        `Sujet: 🔔 Nouvelle commande ${data.orderNumber} à préparer · Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    }
  }

  /**
   * Email client — identité Alto Lille (maquette RARE.design) :
   * crème #FEF7E8, brun #4A2020, orange #F54501, bleu #1B5EC4, encre #161615.
   */
  private generateCustomerEmailHtml(
    data: OrderConfirmationData,
    invoice?: { invoiceNumber: string; invoiceHTML: string }
  ): string {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #EADFC9;">
          <div style="font-weight: 700; color: #161615;">${
            item.productName
          }</div>
          ${
            item.variationValue
              ? `<div style="color: #7a6a5a; font-size: 13px;">${item.variationValue}</div>`
              : ""
          }
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #EADFC9; text-align: center; color: #161615;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #EADFC9; text-align: right; font-weight: 700; color: #161615;">
          ${(item.price * item.quantity * 100).toFixed(2)} €
        </td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Votre commande est confirmée — Alto Lille</title>
      </head>
      <body style="font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #161615; margin: 0; padding: 0; background-color: #FEF7E8;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FEF7E8;">
          <!-- Bandeau brun maquette -->
          <div style="background: #4A2020; color: #FEF7E8; padding: 36px 30px; text-align: center;">
            <img src="https://www.alto-lille.fr/images/alto/favicon.png" alt="" width="34" height="34" style="display: block; margin: 0 auto 10px;" />
            <div style="font-size: 30px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 4px;">ALTO</div>
            <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(254,247,232,0.7); margin-bottom: 22px;">Design &amp; fabrication — Lille</div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Votre commande est confirmée</h1>
            <p style="margin: 12px 0 0 0; font-size: 15px;">
              <span style="display: inline-block; background: #F54501; color: #FEF7E8; font-weight: 700; padding: 6px 14px;">N° ${
                data.orderNumber
              }</span>
            </p>
          </div>

          <!-- Corps principal -->
          <div style="padding: 36px 30px;">
            <!-- Message d'accueil -->
            <div style="margin-bottom: 28px;">
              <h2 style="color: #4A2020; margin: 0 0 12px 0; font-size: 21px; font-weight: 800;">Bonjour ${
                data.customerName
              },</h2>
              <p style="color: #161615; font-size: 15px; margin: 0;">
                Votre paiement est validé — merci ! L'atelier prend le relais :
                chaque pièce est vérifiée et emballée à la main avant de partir de Montreuil-sur-Mer.
              </p>
            </div>

            <!-- Les prochaines étapes -->
            <div style="margin: 28px 0;">
              <h3 style="margin: 0 0 12px 0; color: #4A2020; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;">Les prochaines étapes</h3>
              <div style="background: #FFFFFF; border-left: 4px solid #F54501; padding: 14px 16px; margin-bottom: 10px;">
                <div style="font-weight: 700; color: #161615; margin-bottom: 2px;">01 — Préparation à l'atelier</div>
                <div style="font-size: 14px; color: #7a6a5a;">Sous 24 à 48 h maximum</div>
              </div>
              <div style="background: #FFFFFF; border-left: 4px solid #1B5EC4; padding: 14px 16px;">
                <div style="font-weight: 700; color: #161615; margin-bottom: 2px;">02 — Expédition offerte</div>
                <div style="font-size: 14px; color: #7a6a5a;">Suivi par email · livraison en 2-3 jours</div>
              </div>
            </div>

            <!-- Récapitulatif de commande -->
            <div style="margin: 28px 0;">
              <h3 style="margin: 0 0 12px 0; color: #4A2020; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;">Votre commande</h3>
              <table style="width: 100%; border-collapse: collapse; background: #FFFFFF;">
                <thead>
                  <tr style="background: #4A2020; color: #FEF7E8;">
                    <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">Produit</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; width: 60px;">Qté</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; width: 100px;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background: #F54501; color: #FEF7E8;">
                    <td style="padding: 14px 16px; font-weight: 800;" colspan="2">Total payé</td>
                    <td style="padding: 14px 16px; text-align: right; font-weight: 800; font-size: 17px;">${(data.totalAmount * 100).toFixed(2)} €</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Point relais -->
            ${
              data.relayPoint
                ? `
            <div style="margin: 28px 0;">
              <h3 style="margin: 0 0 12px 0; color: #4A2020; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;">Votre point relais</h3>
              <div style="background: #FFFFFF; border-left: 4px solid #1B5EC4; padding: 16px;">
                <div style="font-weight: 700; color: #161615; font-size: 16px; margin-bottom: 6px;">${data.relayPoint.name}</div>
                <div style="color: #7a6a5a; line-height: 1.5;">
                  ${data.relayPoint.address}<br>
                  ${data.relayPoint.postalCode} ${data.relayPoint.city}
                </div>
                <div style="margin-top: 12px; padding: 10px 12px; background: #FEF7E8; border-left: 3px solid #F54501;">
                  <div style="font-size: 13px; color: #4A2020;">
                    <strong>Pour le retrait :</strong> munissez-vous de votre pièce d'identité et du SMS ou de l'email de confirmation que vous recevrez.
                  </div>
                </div>
              </div>
            </div>
            `
                : ""
            }

            <!-- Confidentialité -->
            <div style="background: #4A2020; color: #FEF7E8; padding: 18px 20px; margin: 28px 0;">
              <div style="font-weight: 700; margin-bottom: 6px;">Promesse tenue</div>
              <div style="font-size: 14px; color: rgba(254,247,232,0.85);">
                Vos données ne servent que pour cette commande.
                <strong style="color: #FF7402;">Zéro spam, zéro revente.</strong>
              </div>
            </div>

            ${
              invoice
                ? `
            <!-- Facture -->
            <div style="background: #FFFFFF; border-left: 4px solid #F54501; padding: 16px 20px; margin: 28px 0;">
              <div style="font-weight: 700; color: #161615; margin-bottom: 4px;">Votre facture N° ${invoice.invoiceNumber}</div>
              <div style="color: #7a6a5a; font-size: 14px;">
                Elle est jointe à cet email — elle fait foi pour vos garanties (2 ans) et vos déclarations.
              </div>
            </div>
            `
                : ""
            }

            <!-- Contact -->
            <div style="text-align: center; margin: 32px 0 0;">
              <div style="color: #161615; font-size: 14px;">
                <strong>Une question ? Un souci ?</strong><br>
                Répondez simplement à cet email, nous sommes là.
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #EADFC9;">
              <div style="color: #4A2020; font-size: 15px; font-weight: 700; margin-bottom: 6px;">
                Merci de votre confiance,
              </div>
              <div style="color: #7a6a5a; font-size: 14px;">
                Anatole — Alto Lille<br>
                <a href="https://www.alto-lille.fr" style="color: #F54501; text-decoration: none;">www.alto-lille.fr</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminEmailHtml(
    data: OrderConfirmationData,
    invoice?: { invoiceNumber: string; invoiceHTML: string }
  ): string {
    const itemsList = data.items
      .map(
        (item) =>
          `• ${item.productName} (${item.variationValue}) x${
            item.quantity
          } - ${(item.price * item.quantity * 100).toFixed(2)}€`
      )
      .join("\n");

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Nouvelle commande à préparer — Alto Lille</title>
      </head>
      <body style="font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #161615; margin: 0; padding: 0; background: #FEF7E8;">
        <div style="max-width: 600px; margin: 0 auto; background: #FEF7E8; padding-bottom: 24px;">
          <div style="background: #F54501; color: #FEF7E8; padding: 24px 26px;">
            <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px;">Alto Lille — Gestion</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Nouvelle commande à préparer</h1>
            <h2 style="margin: 8px 0 0 0; font-size: 17px; font-weight: 700;">N° ${
              data.orderNumber
            }</h2>
          </div>

          <div style="background: #FFFFFF; border-left: 4px solid #4A2020; padding: 16px 20px; margin: 20px 26px 0;">
            <h3 style="margin: 0 0 8px; color: #4A2020; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;">Informations client</h3>
            <p style="margin: 4px 0;"><strong>Nom :</strong> ${
              data.customerName
            }</p>
            <p style="margin: 4px 0;"><strong>Email :</strong> <a href="mailto:${
              data.customerEmail
            }" style="color: #F54501;">${data.customerEmail}</a></p>
            <p style="margin: 4px 0;"><strong>Téléphone :</strong> <a href="tel:${
              data.customerPhone
            }" style="color: #F54501;">${data.customerPhone}</a></p>
          </div>

          <div style="background: #FFFFFF; border-left: 4px solid #F54501; padding: 16px 20px; margin: 16px 26px 0;">
            <h3 style="margin: 0 0 8px; color: #4A2020; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;">Actions à faire</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li><strong>Préparer les articles</strong> (voir liste ci-dessous)</li>
              ${
                data.relayPoint
                  ? `<li><strong>Imprimer l'étiquette</strong> pour ${data.relayPoint.name}</li>`
                  : ""
              }
              <li><strong>Envoyer le colis</strong> avec Mondial Relay</li>
              <li><strong>Envoyer l'email</strong> avec le lien de suivi au client</li>
            </ol>
          </div>

          <div style="background: #FFFFFF; border-left: 4px solid #1B5EC4; padding: 16px 20px; margin: 16px 26px 0;">
            <h3 style="margin: 0 0 8px; color: #4A2020; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;">Articles à expédier</h3>
            <div style="background: #FEF7E8; padding: 14px; font-family: monospace; white-space: pre-line;">${itemsList}</div>
            <p style="margin: 10px 0 0;"><strong>Total :</strong> <span style="color: #F54501; font-weight: 800;">${(data.totalAmount * 100).toFixed(2)} €</span></p>
          </div>

          <div style="background: #4A2020; color: #FEF7E8; padding: 16px 20px; margin: 16px 26px 0;">
            <h3 style="margin: 0 0 8px; color: #FF7402; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;">Adresse point relais</h3>
            <div>
              ${
                data.relayPoint
                  ? `<strong>${data.relayPoint.name}</strong><br>${data.relayPoint.address}<br>${data.relayPoint.postalCode} ${data.relayPoint.city}`
                  : "<strong>Point relais non spécifié</strong>"
              }
            </div>
            <p style="margin: 10px 0 0; font-size: 13px; color: rgba(254,247,232,0.8);">
              <strong>Important :</strong> bien vérifier l'adresse sur l'étiquette Mondial Relay.
            </p>
          </div>

          <div style="text-align: center; padding: 20px 26px 0;">
            <p style="margin: 0; font-size: 13px; color: #7a6a5a;">
              Email envoyé automatiquement le ${new Date().toLocaleString(
                "fr-FR"
              )}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = now.getTime();
    return `ALTO-${year}${month}${day}-${timestamp}`;
  }

  private convertToInvoiceData(
    data: OrderConfirmationData,
    invoiceNumber: string
  ): any {
    return {
      invoiceNumber,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.relayPoint
        ? `${data.relayPoint.name}, ${data.relayPoint.address}, ${data.relayPoint.postalCode} ${data.relayPoint.city}`
        : "Adresse non spécifiée",
      items: data.items.map((item) => ({
        productName: item.productName,
        variationValue: item.variationValue,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal: data.totalAmount,
      shipping: 0, // À adapter selon votre logique
      totalAmount: data.totalAmount,
      issueDate: new Date().toLocaleDateString("fr-FR"),
      relayPoint: data.relayPoint,
    };
  }

  private logAndSaveOrder(data: OrderConfirmationData): void {
    console.log("\n🚀 === COMMANDE TRAITÉE ===");
    console.log("📧 Email client envoyé à:", data.customerEmail);
    console.log("📧 Notification admin envoyée à:", this.adminEmail);
    console.log("🆔 Commande:", data.orderNumber);
    console.log("👤 Client:", data.customerName);
    console.log("📱 Téléphone:", data.customerPhone);
    console.log("💰 Montant:", data.totalAmount.toFixed(2), "€");
    console.log("📍 Point relais:", data.relayPoint?.name || "Non spécifié");
    console.log("============================\n");

    // Sauvegarde de backup
    this.saveOrderBackup(data);
  }

  private saveOrderBackup(data: OrderConfirmationData): void {
    try {
      const orderData = {
        timestamp: new Date().toISOString(),
        orderNumber: data.orderNumber,
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        items: data.items,
        totalAmount: data.totalAmount,
        relayPoint: data.relayPoint,
        status: "nouvelle",
        emailsSent: {
          customer: true,
          admin: true,
          sentAt: new Date().toISOString(),
        },
      };

      const ordersDir = path.join(process.cwd(), "orders-backup");
      if (!fs.existsSync(ordersDir)) {
        fs.mkdirSync(ordersDir, { recursive: true });
      }

      const filename = `${data.orderNumber}_${Date.now()}.json`;
      const filepath = path.join(ordersDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(orderData, null, 2));
      console.log("💾 Commande sauvegardée:", filename);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  }
}

export const notificationService = new NotificationService();
export default NotificationService;
