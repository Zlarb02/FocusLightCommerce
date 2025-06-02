import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

export function ThemeToggle({
  showLabel = true,
  size = "md",
  variant = "default",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`Changer vers le thème ${
          theme === "light" ? "sombre" : "clair"
        }`}
      >
        {theme === "light" ? (
          <Moon className={iconSizes[size]} />
        ) : (
          <Sun className={iconSizes[size]} />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <label
          className={`${sizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 select-none`}
        >
          {theme === "light" ? "Clair" : "Sombre"}
        </label>
      )}
      <div className="flex items-center gap-1">
        <Sun className={`${iconSizes[size]} text-yellow-500`} />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          aria-label={`Changer vers le thème ${
            theme === "light" ? "sombre" : "clair"
          }`}
        />
        <Moon className={`${iconSizes[size]} text-blue-400`} />
      </div>
    </div>
  );
}
