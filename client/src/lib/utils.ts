import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
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
    imagePath: "/src/assets/images/blanche.png",
  },
  Bleu: {
    name: "Bleu",
    displayName: "Bleu",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-600",
    textClass: "text-blue-500",
    imagePath: "/src/assets/images/bleue.png",
  },
  Rouge: {
    name: "Rouge",
    displayName: "Rouge",
    bgClass: "bg-red-500",
    borderClass: "border-red-600",
    textClass: "text-red-500",
    imagePath: "/src/assets/images/rouge.png",
  },
  Orange: {
    name: "Orange",
    displayName: "Orange",
    bgClass: "bg-orange-500",
    borderClass: "border-orange-600",
    textClass: "text-orange-500",
    imagePath: "/src/assets/images/orange.png",
  },
};

export function getColorInfo(colorName: string): LampColor {
  return lampColors[colorName] || lampColors["Blanc"];
}
