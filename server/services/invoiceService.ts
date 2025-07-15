// Service de génération de factures PDF
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productName: string;
    variationValue: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  totalAmount: number;
  issueDate: string;
  relayPoint?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
}

interface CompanyInfo {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  siret?: string;
  tva?: string;
}

export class InvoiceService {
  private companyInfo: CompanyInfo = {
    name: "Alto Lille",
    address: "95 rue Pierre Ledent",
    postalCode: "62170",
    city: "Montreuil-sur-Mer",
    phone: "+33 782 086 690",
    email: "altolille@gmail.com",
    website: "www.alto-lille.fr",
    siret: "94517981000011",
    tva: "FR76 4061 8804 8200 0400 6319 731",
  };

  /**
   * Génère une facture en HTML
   */
  generateInvoiceHTML(data: InvoiceData): string {
    const itemsHTML = data.items
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
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${item.unitPrice.toFixed(2)} €
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
            ${item.totalPrice.toFixed(2)} €
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
        <title>Facture ${data.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-info { font-size: 14px; line-height: 1.5; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #1f2937; }
          .invoice-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .customer-info { margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background: #374151; color: white; padding: 12px; text-align: left; }
          .totals { text-align: right; margin: 20px 0; }
          .total-line { display: flex; justify-content: space-between; margin: 5px 0; }
          .total-final { font-weight: bold; font-size: 18px; color: #059669; }
          .footer { margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
          @media print { body { margin: 0; } .invoice-container { margin: 0; padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- En-tête -->
          <div class="header">
            <div>
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">${
                this.companyInfo.name
              }</h1>
              <div class="company-info">
                ${this.companyInfo.address}<br>
                ${this.companyInfo.postalCode} ${this.companyInfo.city}<br>
                Tél: ${this.companyInfo.phone}<br>
                Email: ${this.companyInfo.email}<br>
                ${
                  this.companyInfo.siret
                    ? `SIRET: ${this.companyInfo.siret}<br>`
                    : ""
                }
                ${this.companyInfo.tva ? `TVA: ${this.companyInfo.tva}` : ""}
              </div>
            </div>
            <div style="text-align: right;">
              <div class="invoice-title">FACTURE</div>
              <div style="font-size: 18px; margin: 10px 0;">N° ${
                data.invoiceNumber
              }</div>
              <div style="color: #6b7280;">Date: ${data.issueDate}</div>
            </div>
          </div>

          <!-- Informations client -->
          <div class="customer-info">
            <h3 style="color: #1f2937; margin-bottom: 10px;">Facturé à :</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <strong>${data.customerName}</strong><br>
              ${data.customerEmail}<br>
              ${data.customerPhone}<br>
              ${data.customerAddress}
            </div>
          </div>

          <!-- Point relais si applicable -->
          ${
            data.relayPoint
              ? `
          <div class="customer-info">
            <h3 style="color: #1f2937; margin-bottom: 10px;">Livraison en point relais :</h3>
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #a7f3d0;">
              <strong>${data.relayPoint.name}</strong><br>
              ${data.relayPoint.address}<br>
              ${data.relayPoint.postalCode} ${data.relayPoint.city}
            </div>
          </div>
          `
              : ""
          }

          <!-- Détails de la commande -->
          <div class="invoice-details">
            <strong>Commande N° ${data.orderNumber}</strong><br>
            Méthode de paiement: Carte bancaire (Stripe)<br>
            Statut: Payé
          </div>

          <!-- Articles -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Article</th>
                <th style="text-align: center; width: 80px;">Qté</th>
                <th style="text-align: right; width: 100px;">Prix unit.</th>
                <th style="text-align: right; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Totaux -->
          <div class="totals">
            <div class="total-line">
              <span>Sous-total:</span>
              <span>${data.subtotal.toFixed(2)} €</span>
            </div>
            <div class="total-line">
              <span>Livraison:</span>
              <span style="color: #059669;">${
                data.shipping === 0
                  ? "Gratuite"
                  : data.shipping.toFixed(2) + " €"
              }</span>
            </div>
            <hr style="margin: 10px 0;">
            <div class="total-line total-final">
              <span>TOTAL TTC (TVA incluse):</span>
              <span>${data.totalAmount.toFixed(2)} €</span>
            </div>
          </div>

          <!-- Pied de page légal -->
          <div class="footer">
            <p><strong>Conditions de vente et mentions légales</strong></p>
            <p>
              Facture générée automatiquement le ${new Date().toLocaleDateString(
                "fr-FR"
              )} à ${new Date().toLocaleTimeString("fr-FR")}<br>
              Paiement effectué par carte bancaire via Stripe - Transaction sécurisée<br>
              ${this.companyInfo.name} - ${
      this.companyInfo.siret ? `SIRET: ${this.companyInfo.siret}` : ""
    } - ${this.companyInfo.tva ? `TVA: ${this.companyInfo.tva}` : ""}
            </p>
            <p style="margin-top: 20px;">
              <strong>Garantie et retours :</strong> Produits garantis 2 ans - Retour possible sous 30 jours<br>
              <strong>Contact :</strong> ${this.companyInfo.email} - ${
      this.companyInfo.phone
    }
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Génère un PDF de la facture à partir du HTML
   */
  async generateInvoicePDF(
    invoiceHTML: string,
    invoiceNumber: string
  ): Promise<Buffer> {
    let browser;
    try {
      // Lancer Puppeteer avec des options optimisées pour la production
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--single-process", // Utile pour certains environnements comme Docker
        ],
      });

      const page = await browser.newPage();

      // Configurer la page pour l'impression
      await page.setContent(invoiceHTML, {
        waitUntil: "networkidle0", // Attendre que toutes les ressources soient chargées
      });

      // Optionnel: Émuler le type de média pour l'impression
      await page.emulateMediaType("print");

      // Générer le PDF avec des options optimisées pour les factures
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true, // Inclure les couleurs de fond
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
        displayHeaderFooter: false, // On utilise notre propre en-tête/pied de page
        preferCSSPageSize: false, // Utiliser le format A4 défini
        scale: 1, // Échelle normale
      });

      // Optionnel: Sauvegarder le PDF sur le disque
      try {
        const invoicesDir = path.join(process.cwd(), "invoices");
        if (!fs.existsSync(invoicesDir)) {
          fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const pdfFilename = `facture-${invoiceNumber}.pdf`;
        const pdfFilepath = path.join(invoicesDir, pdfFilename);

        fs.writeFileSync(pdfFilepath, pdfBuffer);
        console.log("📄 Facture PDF sauvegardée:", pdfFilename);
      } catch (saveError) {
        console.error("Erreur sauvegarde PDF:", saveError);
        // Ne pas faire échouer la génération si la sauvegarde échoue
      }

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      throw new Error(`Impossible de générer le PDF: ${errorMessage}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Génère et sauvegarde une facture
   */
  async generateInvoice(
    orderData: any
  ): Promise<{
    invoiceNumber: string;
    invoiceHTML: string;
    invoicePDF: Buffer;
  }> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // Générer un numéro de facture unique
    const invoiceNumber = `${year}${month}${day}-${orderData.orderId
      .toString()
      .padStart(4, "0")}`;

    const invoiceData: InvoiceData = {
      invoiceNumber,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: `${orderData.customer?.address || ""}\n${
        orderData.customer?.postalCode || ""
      } ${orderData.customer?.city || ""}`.trim(),
      items: orderData.items.map((item: any) => ({
        productName: item.productName,
        variationValue: item.variationValue || "",
        quantity: item.quantity,
        unitPrice: item.price * 100, // Convertir vers euros normaux
        totalPrice: item.price * item.quantity * 100, // Convertir vers euros normaux
      })),
      subtotal: orderData.totalAmount * 100, // Convertir vers euros normaux
      shipping: 0, // Livraison gratuite
      totalAmount: orderData.totalAmount * 100, // Convertir vers euros normaux
      issueDate: now.toLocaleDateString("fr-FR"),
      relayPoint: orderData.relayPoint,
    };

    const invoiceHTML = this.generateInvoiceHTML(invoiceData);

    // Générer le PDF de la facture
    let invoicePDF: Buffer;
    try {
      invoicePDF = await this.generateInvoicePDF(invoiceHTML, invoiceNumber);
    } catch (error) {
      console.error("Erreur génération PDF de la facture:", error);
      // En cas d'erreur PDF, on continue avec juste le HTML
      throw error; // On peut décider si on veut faire échouer ou continuer
    }

    // Sauvegarder la facture HTML
    try {
      const invoicesDir = path.join(process.cwd(), "invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filename = `facture-${invoiceNumber}.html`;
      const filepath = path.join(invoicesDir, filename);

      fs.writeFileSync(filepath, invoiceHTML);
      console.log("💾 Facture HTML sauvegardée:", filename);
    } catch (error) {
      console.error("Erreur sauvegarde facture HTML:", error);
    }

    return {
      invoiceNumber,
      invoiceHTML,
      invoicePDF,
    };
  }
}

export const invoiceService = new InvoiceService();
