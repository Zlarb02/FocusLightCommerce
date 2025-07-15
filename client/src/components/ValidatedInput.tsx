import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Mail, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ValidatedInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  privacyNote?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onValidationChange,
  type = "text",
  placeholder,
  required = false,
  helperText,
  privacyNote,
  className = "",
  disabled = false,
  autoComplete,
}) => {
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation en temps réel
  useEffect(() => {
    if (!touched && !value) {
      setError("");
      setIsValid(false);
      return;
    }

    let validationError = "";
    let valid = false;

    // Validation required
    if (required && (!value || value.trim() === "")) {
      validationError = "Ce champ est requis";
    }
    // Validation email
    else if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        validationError = "Adresse email invalide";
      } else {
        valid = true;
      }
    }
    // Validation téléphone
    else if (type === "tel" && value) {
      const cleanPhone = value.replace(/[\s\-\.]/g, "");
      const phoneRegex = /^(?:(?:\+33|0033|0)[1-9](?:[0-9]{8}))$/;
      if (!phoneRegex.test(cleanPhone)) {
        validationError = "Format: 06 12 34 56 78 ou +33 6 12 34 56 78";
      } else {
        valid = true;
      }
    }
    // Validation texte simple
    else if (type === "text" && value) {
      if (value.trim().length >= 2) {
        valid = true;
      } else {
        validationError = "Au moins 2 caractères requis";
      }
    }

    setError(validationError);
    setIsValid(valid);
  }, [value, touched, type, required]);

  // Notifier les changements de validation séparément
  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Formatage automatique pour le téléphone
    if (type === "tel") {
      const digits = newValue.replace(/\D/g, "");
      const limitedDigits = digits.slice(0, 10);

      if (limitedDigits.length >= 2) {
        newValue = limitedDigits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
      } else {
        newValue = limitedDigits;
      }
    }

    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getIcon = () => {
    if (type === "email") return Mail;
    if (type === "tel") return Phone;
    return User;
  };

  const Icon = getIcon();

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-2 font-medium">
        <Icon className="w-4 h-4 text-gray-500" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn("pr-10 transition-all duration-200", {
            "border-green-500 bg-green-50/30 dark:bg-green-900/10":
              isValid && touched,
            "border-red-500 bg-red-50/30 dark:bg-red-900/10": error && touched,
            "focus:border-blue-500": !error && !isValid,
          })}
        />

        {/* Icône de validation */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {isValid && touched ? (
              <motion.div
                key="valid"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 text-green-500" />
              </motion.div>
            ) : error && touched ? (
              <motion.div
                key="error"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages d'aide et erreur */}
      <AnimatePresence mode="wait">
        {error && touched ? (
          <motion.p
            key="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            key="helper-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </motion.p>
        ) : privacyNote ? (
          <motion.div
            key="privacy-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2"
          >
            🔒 {privacyNote}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
