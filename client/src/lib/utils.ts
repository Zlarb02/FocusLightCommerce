import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  // Arrondir le prix à l'entier et formater sans décimales
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderNumber(orderId: number): string {
  return `FC-${new Date().getFullYear()}${orderId.toString().padStart(4, "0")}`;
}

export interface LampColor {
  name: string;
  displayName: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  imagePath: string;
}

export const lampColors: Record<string, LampColor> = {
  Blanc: {
    name: "Blanc",
    displayName: "Blanc",
    bgClass: "bg-gray-100",
    borderClass: "border-gray-200",
    textClass: "text-gray-700",
    imagePath:
      "https://www.alto-lille.fr/uploads/fbf9e3c1-9afe-446f-9e3d-5966f078b4c0.png",
  },
  Bleu: {
    name: "Bleu",
    displayName: "Bleu",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-600",
    textClass: "text-blue-500",
    imagePath:
      "https://www.alto-lille.fr/uploads/6b611585-bb6c-411c-85bf-342fe95950c6.png",
  },
  Rouge: {
    name: "Rouge",
    displayName: "Rouge",
    bgClass: "bg-red-500",
    borderClass: "border-red-600",
    textClass: "text-red-500",
    imagePath:
      "https://www.alto-lille.fr/uploads/1f1cdf28-f233-4191-9c1a-f9d7e12b709f.png",
  },
  Orange: {
    name: "Orange",
    displayName: "Orange",
    bgClass: "bg-orange-500",
    borderClass: "border-orange-600",
    textClass: "text-orange-500",
    imagePath:
      "https://www.alto-lille.fr/uploads/a8e085a1-8bc5-4c90-a738-151c7ce4d8d0.png",
  },
};

export function getColorInfo(colorName: string): LampColor {
  return lampColors[colorName] || lampColors["Blanc"];
}
