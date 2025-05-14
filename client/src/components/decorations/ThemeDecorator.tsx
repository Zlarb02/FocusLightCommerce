import React from "react";
import { ThemeDecoration } from "/Users/etiennepogoda/Downloads/FocusLightCommerce/shared/schema";
import OctoberDecoration from "./halloween/october";
import JulyDecoration from "./summer/july";
import DecemberDecoration from "./winter/december";
import AprilDecoration from "./april-fool/april";

interface ThemeDecorationProps {
  decoration: ThemeDecoration;
}

/**
 * Composant qui affiche des décorations saisonnières en fonction du thème sélectionné
 */
const ThemeDecorator: React.FC<ThemeDecorationProps> = ({ decoration }) => {
  if (decoration === "none") return null;

  switch (decoration) {
    case "halloween":
      return <OctoberDecoration />;
    case "summer-sale":
      return <JulyDecoration />;
    case "christmas":
      return <DecemberDecoration />;
    case "april-fools":
      return <AprilDecoration />;
    default:
      return null;
  }
};

export default ThemeDecorator;
