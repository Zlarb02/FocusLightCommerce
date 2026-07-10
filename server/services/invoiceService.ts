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
   * Génère une facture en HTML — identité Alto Lille (maquette RARE.design) :
   * crème #FEF7E8, brun #4A2020, orange #F54501, encre #161615.
   */
  generateInvoiceHTML(data: InvoiceData): string {
    const itemsHTML = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #EADFC9;">
            <div style="font-weight: 700; color: #161615;">${
              item.productName
            }</div>
            ${
              item.variationValue
                ? `<div style="color: #7a6a5a; font-size: 13px;">${item.variationValue}</div>`
                : ""
            }
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #EADFC9; text-align: center; color: #161615;">
            ${item.quantity}
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #EADFC9; text-align: right; color: #161615;">
            ${item.unitPrice.toFixed(2)} €
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #EADFC9; text-align: right; font-weight: 700; color: #161615;">
            ${item.totalPrice.toFixed(2)} €
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
        <title>Facture ${data.invoiceNumber} — Alto Lille</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
            color: #161615;
            margin: 0;
            background: #FEF7E8;
          }
          .invoice-container { max-width: 800px; margin: 0 auto; background: #FEF7E8; }
          .band {
            background: #4A2020;
            color: #FEF7E8;
            padding: 32px 36px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .brand { font-size: 34px; font-weight: 800; letter-spacing: 0.02em; margin: 0; }
          .brand small { display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(254,247,232,0.7); margin-top: 4px; }
          .invoice-meta { text-align: right; }
          .invoice-title { font-size: 22px; font-weight: 800; letter-spacing: 0.14em; }
          .invoice-number { color: #FF7402; font-weight: 700; margin-top: 6px; }
          .invoice-date { color: rgba(254,247,232,0.7); font-size: 13px; margin-top: 4px; }
          .content { padding: 28px 36px 36px; }
          .grid { display: flex; gap: 16px; margin: 0 0 20px; }
          .box { flex: 1; background: #FFFFFF; border-left: 4px solid #F54501; padding: 14px 16px; font-size: 14px; line-height: 1.55; }
          .box.blue { border-left-color: #1B5EC4; }
          .box h3 { margin: 0 0 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4A2020; }
          .order-strip { background: #4A2020; color: #FEF7E8; padding: 12px 16px; font-size: 13px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
          .order-strip strong { color: #FF7402; }
          .items-table { width: 100%; border-collapse: collapse; margin: 0 0 8px; background: #FFFFFF; }
          .items-table th {
            background: #4A2020; color: #FEF7E8; padding: 12px 16px; text-align: left;
            font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          }
          .totals { margin: 20px 0 0; margin-left: auto; width: 300px; font-size: 14px; }
          .total-line { display: flex; justify-content: space-between; padding: 5px 0; }
          .total-final {
            background: #F54501; color: #FEF7E8; font-weight: 800; font-size: 17px;
            padding: 12px 16px; margin-top: 10px; display: flex; justify-content: space-between;
          }
          .footer { margin-top: 40px; font-size: 11px; color: #7a6a5a; text-align: center; line-height: 1.7; border-top: 1px solid #EADFC9; padding-top: 20px; }
          .footer strong { color: #4A2020; }
          @media print { body { margin: 0; } .content { padding: 24px 28px 28px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Bandeau brun maquette -->
          <div class="band">
            <div>
              <svg width="30" height="30" viewBox="0 0 100 100" style="display: block; margin-bottom: 10px;" aria-hidden="true">
                <path fill="#F54501" fill-rule="evenodd" d="M0 0h100v100H0V0zm50 1.5A48.5 48.5 0 1 0 50 98.5 48.5 48.5 0 0 0 50 1.5z"/>
              </svg>
              <h1 class="brand">ALTO<small>Design &amp; fabrication — Lille</small></h1>
              <div style="font-size: 13px; line-height: 1.6; margin-top: 14px; color: rgba(254,247,232,0.85);">
                ${this.companyInfo.address}<br>
                ${this.companyInfo.postalCode} ${this.companyInfo.city}<br>
                ${this.companyInfo.phone} · ${this.companyInfo.email}<br>
                ${this.companyInfo.website}
              </div>
            </div>
            <div class="invoice-meta">
              <div class="invoice-title">FACTURE</div>
              <div class="invoice-number">N° ${data.invoiceNumber}</div>
              <div class="invoice-date">Émise le ${data.issueDate}</div>
            </div>
          </div>

          <div class="content">
            <!-- Client + livraison -->
            <div class="grid">
              <div class="box">
                <h3>Facturé à</h3>
                <strong>${data.customerName}</strong><br>
                ${data.customerEmail}<br>
                ${data.customerPhone}<br>
                ${data.customerAddress}
              </div>
              ${
                data.relayPoint
                  ? `
              <div class="box blue">
                <h3>Livraison en point relais</h3>
                <strong>${data.relayPoint.name}</strong><br>
                ${data.relayPoint.address}<br>
                ${data.relayPoint.postalCode} ${data.relayPoint.city}
              </div>
              `
                  : ""
              }
            </div>

            <!-- Détails de la commande -->
            <div class="order-strip">
              <span>Commande <strong>N° ${data.orderNumber}</strong></span>
              <span>Paiement : carte bancaire (Stripe)</span>
              <span>Statut : <strong>Payé</strong></span>
            </div>

            <!-- Articles -->
            <table class="items-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th style="text-align: center; width: 70px;">Qté</th>
                  <th style="text-align: right; width: 110px;">Prix unit.</th>
                  <th style="text-align: right; width: 110px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <!-- Totaux -->
            <div class="totals">
              <div class="total-line">
                <span>Sous-total</span>
                <span>${data.subtotal.toFixed(2)} €</span>
              </div>
              <div class="total-line">
                <span>Livraison</span>
                <span style="color: #1B5EC4; font-weight: 700;">${
                  data.shipping === 0
                    ? "Offerte"
                    : data.shipping.toFixed(2) + " €"
                }</span>
              </div>
              <div class="total-final">
                <span>TOTAL TTC</span>
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
                Paiement effectué par carte bancaire via Stripe — transaction sécurisée<br>
                ${this.companyInfo.name} ${
      this.companyInfo.siret ? `— SIRET : ${this.companyInfo.siret}` : ""
    } ${this.companyInfo.tva ? `— TVA : ${this.companyInfo.tva}` : ""}
              </p>
              <p style="margin-top: 16px;">
                <strong>Garantie et retours :</strong> produits garantis 2 ans — retour possible sous 30 jours<br>
                <strong>Contact :</strong> ${this.companyInfo.email} · ${
      this.companyInfo.phone
    }
              </p>
            </div>
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
  async generateInvoice(orderData: any): Promise<{
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
        unitPrice: item.price * 100,
        totalPrice: item.price * item.quantity * 100,
      })),
      subtotal: orderData.totalAmount * 100,
      shipping: 0, // Livraison gratuite
      totalAmount: orderData.totalAmount * 100,
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

  /**
   * Génère uniquement la facture HTML (sans PDF)
   */
  async generateInvoiceHTMLOnly(orderData: any): Promise<{
    invoiceNumber: string;
    invoiceHTML: string;
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
        unitPrice: item.price * 100,
        totalPrice: item.price * item.quantity * 100,
      })),
      subtotal: orderData.totalAmount * 100,
      shipping: 0, // Livraison gratuite
      totalAmount: orderData.totalAmount * 100,
      issueDate: now.toLocaleDateString("fr-FR"),
      relayPoint: orderData.relayPoint,
    };

    const invoiceHTML = this.generateInvoiceHTML(invoiceData);

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
    };
  }
}

export const invoiceService = new InvoiceService();
