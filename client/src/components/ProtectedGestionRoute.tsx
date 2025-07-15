import { ComponentType } from "react";
import { AuthGuard } from "./AuthGuard";

interface ProtectedGestionRouteProps {
  component: ComponentType;
}

/**
 * Composant qui enveloppe automatiquement toutes les pages de gestion avec AuthGuard
 * pour garantir que seuls les admins authentifiés puissent y accéder
 */
export default function ProtectedGestionRoute({
  component: Component,
}: ProtectedGestionRouteProps) {
  return (
    <AuthGuard>
      <Component />
    </AuthGuard>
  );
}
