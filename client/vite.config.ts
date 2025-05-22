import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import * as path from "path";
import { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Vérifie si le fichier theme.json existe, sinon crée un fichier par défaut
const themeFile = path.resolve(__dirname, "theme.json");
if (!fs.existsSync(themeFile)) {
  const defaultTheme = {
    variant: "professional",
    primary: "hsl(222.2 47.4% 50.2%)",
    appearance: "light",
    radius: 0.5,
  };
  fs.writeFileSync(themeFile, JSON.stringify(defaultTheme, null, 2));
}

export default defineConfig(async () => {
  // Dynamiquement importer le plugin cartographer si nécessaire
  const devPlugins = [];
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
  ) {
    const cartographerModule = await import("@replit/vite-plugin-cartographer");
    devPlugins.push(cartographerModule.cartographer());
  }

  return {
    plugins: [react(), runtimeErrorOverlay(), themePlugin(), ...devPlugins],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
        "@assets": path.resolve(__dirname, "..", "attached_assets"),
      },
    },
    server: {
      proxy: {
        "/uploads": {
          target:
            process.env.NODE_ENV === "production"
              ? "https://api-focus.pogodev.com"
              : "http://localhost:5000",
          changeOrigin: true,
          secure: process.env.NODE_ENV === "production",
        },
        "/api": {
          target:
            process.env.NODE_ENV === "production"
              ? "https://api-focus.pogodev.com"
              : "http://localhost:5000",
          changeOrigin: true,
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      sourcemap: process.env.NODE_ENV !== "production",
    },
    base: "/",
    define: {
      "process.env": {},
    },
  };
});
