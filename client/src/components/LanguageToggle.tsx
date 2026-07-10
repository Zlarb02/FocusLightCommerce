import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LanguageToggleProps {
  variant?: "switch" | "button" | "minimal";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = "switch",
  size = "default",
  showLabel = true,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={handleLanguageChange}
        className="p-2 text-current opacity-80 hover:opacity-100 transition-all duration-300 ease-out hover:scale-110"
        aria-label={`Changer de langue - Actuel: ${language.toUpperCase()}`}
      >
        <span className="text-sm font-medium">{language.toUpperCase()}</span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleLanguageChange}
        className="min-w-[50px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300"
      >
        {language.toUpperCase()}
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {showLabel && (
        <Label
          htmlFor="language-toggle"
          className={`text-sm font-medium ${
            language === "fr" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          FR
        </Label>
      )}
      <Switch
        id="language-toggle"
        checked={language === "en"}
        onCheckedChange={handleLanguageChange}
      />
      {showLabel && (
        <Label
          htmlFor="language-toggle"
          className={`text-sm font-medium ${
            language === "en" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          EN
        </Label>
      )}
    </div>
  );
};
