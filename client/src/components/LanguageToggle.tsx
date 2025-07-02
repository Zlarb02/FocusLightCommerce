import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LanguageToggleProps {
  variant?: "switch" | "button";
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

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleLanguageChange}
        className="min-w-[50px]"
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
