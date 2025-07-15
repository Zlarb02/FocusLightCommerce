import { useState, useCallback } from "react";

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (name: string, value: string, rules: ValidationRules): ValidationResult => {
      // Supprime l'erreur existante pour ce champ
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      // Validation required
      if (rules.required && (!value || value.trim() === "")) {
        const error = "Ce champ est requis";
        setErrors((prev) => ({ ...prev, [name]: error }));
        return { isValid: false, error };
      }

      // Validation email
      if (rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          const error = "Adresse email invalide";
          setErrors((prev) => ({ ...prev, [name]: error }));
          return { isValid: false, error };
        }
      }

      // Validation téléphone français
      if (rules.phone && value) {
        // Nettoie le numéro (supprime espaces, tirets, points)
        const cleanPhone = value.replace(/[\s\-\.]/g, "");

        // Format français : 10 chiffres commençant par 0, ou +33 suivi de 9 chiffres
        const phoneRegex = /^(?:(?:\+33|0033|0)[1-9](?:[0-9]{8}))$/;

        if (!phoneRegex.test(cleanPhone)) {
          const error =
            "Numéro de téléphone invalide (format français attendu)";
          setErrors((prev) => ({ ...prev, [name]: error }));
          return { isValid: false, error };
        }
      }

      // Validation longueur minimale
      if (rules.minLength && value.length < rules.minLength) {
        const error = `Minimum ${rules.minLength} caractères requis`;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return { isValid: false, error };
      }

      // Validation longueur maximale
      if (rules.maxLength && value.length > rules.maxLength) {
        const error = `Maximum ${rules.maxLength} caractères autorisés`;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return { isValid: false, error };
      }

      return { isValid: true };
    },
    []
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    clearErrors,
    clearError,
    hasErrors: Object.keys(errors).length > 0,
  };
};

// Helper pour formater le numéro de téléphone français
export const formatPhoneNumber = (value: string): string => {
  // Supprime tout ce qui n'est pas un chiffre
  const digits = value.replace(/\D/g, "");

  // Limite à 10 chiffres pour un numéro français
  const limitedDigits = digits.slice(0, 10);

  // Formate en xx xx xx xx xx
  if (limitedDigits.length >= 2) {
    return limitedDigits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }

  return limitedDigits;
};

// Helper pour valider email en temps réel
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper pour valider téléphone en temps réel
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\.]/g, "");
  const phoneRegex = /^(?:(?:\+33|0033|0)[1-9](?:[0-9]{8}))$/;
  return phoneRegex.test(cleanPhone);
};
