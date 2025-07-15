// Script de test pour vérifier la configuration email
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmailConfig() {
  console.log("🧪 Test de la configuration email...\n");

  // Afficher la configuration (sans le mot de passe)
  console.log("📧 Configuration SMTP :");
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`Pass: ${process.env.SMTP_PASS ? "***masqué***" : "NON DÉFINI"}`);
  console.log(`Shop Email: ${process.env.SHOP_EMAIL}`);
  console.log(`Admin Email: ${process.env.ADMIN_EMAIL}\n`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Test de connexion
    console.log("🔌 Test de connexion SMTP...");
    await transporter.verify();
    console.log("✅ Connexion SMTP réussie !");

    // Envoi d'un email de test
    console.log("📨 Envoi d'un email de test...");
    const info = await transporter.sendMail({
      from: process.env.SHOP_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "✅ Test FocusLight Commerce - Configuration Email OK",
      html: `
        <h2>🎉 Félicitations !</h2>
        <p>Votre configuration email fonctionne parfaitement.</p>
        <p><strong>Date du test :</strong> ${new Date().toLocaleString(
          "fr-FR"
        )}</p>
        <p><strong>Service :</strong> FocusLight Commerce Email Service</p>
        <hr>
        <p><em>Vous pouvez maintenant supprimer ce fichier test-email.js</em></p>
      `,
    });

    console.log("✅ Email de test envoyé avec succès !");
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log("\n🚀 Votre système d'email est opérationnel !");
  } catch (error) {
    console.error("❌ Erreur lors du test :", error.message);

    if (error.message.includes("Invalid login")) {
      console.log("\n💡 Solutions possibles :");
      console.log(
        "1. Vérifiez que la validation en 2 étapes est activée sur Gmail"
      );
      console.log("2. Générez un nouveau mot de passe d'application");
      console.log("3. Vérifiez que SMTP_USER et SMTP_PASS sont corrects");
    }
  }
}

testEmailConfig();
