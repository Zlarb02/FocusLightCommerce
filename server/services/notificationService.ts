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
        subject: `✅ Commande ${data.orderNumber} confirmée - Facture ${invoice.invoiceNumber}`,
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
        `Sujet: ✅ Commande ${data.orderNumber} confirmée - Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    } catch (error) {
      console.error("❌ Erreur envoi email client:", error);
      // En cas d'erreur, on log quand même les détails pour debug
      console.log(`📧 Email client (non envoyé):`);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${data.customerEmail}`);
      console.log(
        `Sujet: ✅ Commande ${data.orderNumber} confirmée - Facture ${invoice.invoiceNumber}`
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
        subject: `🚨 NOUVELLE COMMANDE ${data.orderNumber} - Facture ${invoice.invoiceNumber}`,
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
        `Sujet: 🚨 NOUVELLE COMMANDE ${data.orderNumber} - Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    } catch (error) {
      console.error("❌ Erreur envoi email admin:", error);
      // En cas d'erreur, on log quand même les détails pour debug
      console.log(`📧 Notification admin (non envoyée):`);
      console.log(`De: ${this.shopEmail}`);
      console.log(`À: ${this.adminEmail}`);
      console.log(
        `Sujet: 🚨 NOUVELLE COMMANDE ${data.orderNumber} - Facture ${invoice.invoiceNumber}`
      );
      console.log("---");
    }
  }

  private generateCustomerEmailHtml(
    data: OrderConfirmationData,
    invoice?: { invoiceNumber: string; invoiceHTML: string }
  ): string {
    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500;">${item.productName}</div>
          <div style="color: #6b7280; font-size: 14px;">${
            item.variationValue
          }</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
          ${(item.price * item.quantity * 100).toFixed(2)} €
        </td>
      </tr>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Votre commande est confirmée !</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header avec gradient moderne -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">C'est parti !</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Votre commande N° ${
              data.orderNumber
            } est confirmée</p>
          </div>
          
          <!-- Corps principal -->
          <div style="padding: 40px 30px;">
            <!-- Message d'accueil personnalisé -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px;">Bonjour ${
                data.customerName
              } ! 👋</h2>
              <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">
                Super nouvelle : votre paiement est validé et nous nous chargeons de tout maintenant !<br>
                Installez-vous confortablement, on s'occupe de la suite.
              </p>
            </div>

            <!-- Timeline du processus -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #bae6fd;">
              <h3 style="margin: 0 0 20px 0; color: #0c4a6e; font-size: 18px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #0ea5e9; border-radius: 50%; color: white; text-align: center; line-height: 24px; margin-right: 10px; font-size: 14px;">✓</span>
                Voici ce qui se passe maintenant
              </h3>
              
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 200px; background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #f59e0b;">
                  <div style="font-weight: 600; color: #92400e; margin-bottom: 5px;">⚡ Préparation express</div>
                  <div style="font-size: 14px; color: #6b7280;">24-48h max • On fait au plus vite !</div>
                </div>
                
                <div style="flex: 1; min-width: 200px; background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
                  <div style="font-weight: 600; color: #065f46; margin-bottom: 5px;">📦 Expédition gratuite</div>
                  <div style="font-size: 14px; color: #6b7280;">Suivi par email • Livraison 2-3 jours</div>
                </div>
              </div>
            </div>

            <!-- Récapitulatif de commande moderne -->
            <div style="margin: 30px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Récap de votre commande</h3>
              <div style="background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #374151; color: white;">
                      <th style="padding: 15px; text-align: left; font-weight: 600;">Produit</th>
                      <th style="padding: 15px; text-align: center; font-weight: 600; width: 80px;">Qté</th>
                      <th style="padding: 15px; text-align: right; font-weight: 600; width: 100px;">Prix</th>
                    </tr>
                  </thead>
                  <tbody style="background: white;">
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr style="background: #f3f4f6;">
                      <td style="padding: 15px; font-weight: 700; color: #1f2937;" colspan="2">Total payé</td>
                      <td style="padding: 15px; text-align: right; font-weight: 700; color: #059669; font-size: 18px;">${(
                        data.totalAmount * 100
                      ).toFixed(2)} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Point relais avec style moderne -->
            ${
              data.relayPoint
                ? `
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #a7f3d0;">
              <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px; display: flex; align-items: center;">
                📍 Votre point relais
              </h3>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <div style="font-weight: 700; color: #1f2937; font-size: 16px; margin-bottom: 8px;">${data.relayPoint.name}</div>
                <div style="color: #6b7280; line-height: 1.4;">
                  ${data.relayPoint.address}<br>
                  ${data.relayPoint.postalCode} ${data.relayPoint.city}
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #fef3c7; border-radius: 6px; border-left: 3px solid #f59e0b;">
                  <div style="font-size: 14px; color: #92400e;">
                    <strong>💡 Pour le retrait :</strong> Munissez-vous de votre pièce d'identité et du SMS/email de confirmation que vous recevrez.
                  </div>
                </div>
              </div>
            </div>
            `
                : ""
            }

            <!-- Message rassurant sur la confidentialité -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin: 30px 0; border: 1px solid #93c5fd; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
              <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">Promesse tenue !</div>
              <div style="color: #3730a3; font-size: 14px; line-height: 1.4;">
                Vos données ne servent QUE pour cette commande.<br>
                <strong>Zéro spam, zéro revente, zéro stress.</strong>
              </div>
            </div>

            ${
              invoice
                ? `
            <!-- Facture -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; margin: 30px 0; border: 1px solid #86efac; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 10px;">📄</div>
              <div style="font-weight: 600; color: #166534; margin-bottom: 8px;">Votre facture</div>
              <div style="color: #15803d; font-size: 14px; line-height: 1.4; margin-bottom: 15px;">
                Facture N° ${invoice.invoiceNumber}<br>
                <strong>Consultez le fichier joint à cet email</strong>
              </div>
              <div style="color: #166534; font-size: 12px;">
                💡 Cette facture fait foi pour vos déclarations et garanties
              </div>
            </div>
            `
                : ""
            }

            <!-- Contact amical -->
            <div style="text-align: center; margin: 40px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="font-size: 20px; margin-bottom: 10px;">💬</div>
                <div style="color: #475569; font-size: 14px;">
                  <strong>Une question ? Un souci ?</strong><br>
                  Répondez simplement à cet email, on est là ! 😊
                </div>
              </div>
            </div>

            <!-- Footer chaleureux -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
              <div style="color: #6b7280; font-size: 16px; margin-bottom: 10px;">
                Merci de votre confiance ! ❤️
              </div>
              <div style="color: #9ca3af; font-size: 14px;">
                L'équipe Alto Lille
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
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle commande à traiter</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0;">🚨 NOUVELLE COMMANDE À TRAITER</h1>
            <h2 style="margin: 10px 0 0 0;">N° ${data.orderNumber}</h2>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1f2937;">👤 INFORMATIONS CLIENT</h3>
            <p><strong>Nom :</strong> ${data.customerName}</p>
            <p><strong>Email :</strong> <a href="mailto:${
              data.customerEmail
            }">${data.customerEmail}</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:${
              data.customerPhone
            }">${data.customerPhone}</a></p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #065f46;">🎯 ACTIONS À FAIRE</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li><strong>Préparer les articles</strong> (voir liste ci-dessous)</li>
              ${
                data.relayPoint
                  ? `<li><strong>Imprimer étiquette</strong> pour ${data.relayPoint.name}</li>`
                  : ""
              }
              <li><strong>Envoyer le colis</strong> avec Mondial Relay</li>
              <li><strong>Envoyer email</strong> avec lien de suivi au client</li>
            </ol>
          </div>

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1e40af;">📦 ARTICLES À EXPÉDIER</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-line;">${itemsList}</div>
            <p><strong>Total :</strong> ${(data.totalAmount * 100).toFixed(
              2
            )} €</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #92400e;">📍 ADRESSE POINT RELAIS</h3>
            <div style="background: white; padding: 15px; border-radius: 5px;">
              ${
                data.relayPoint
                  ? `<strong>${data.relayPoint.name}</strong><br>${data.relayPoint.address}<br>${data.relayPoint.postalCode} ${data.relayPoint.city}`
                  : "<strong>Point relais non spécifié</strong>"
              }
            </div>
            <p style="margin-top: 10px; font-size: 14px; color: #92400e;">
              ⚠️ <strong>Important :</strong> Bien vérifier l'adresse sur l'étiquette Mondial Relay
            </p>
          </div>

          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
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
