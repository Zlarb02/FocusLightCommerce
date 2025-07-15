import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    isAdmin: boolean;
  };
}

/**
 * Middleware pour vérifier que l'utilisateur est authentifié et admin
 * À utiliser sur toutes les routes sensibles de l'API
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Vérifier la session
  if (!req.session?.user) {
    res.status(401).json({
      message: "Non authentifié. Connexion requise.",
      code: "AUTHENTICATION_REQUIRED",
    });
    return;
  }

  // Vérifier les privilèges admin
  if (!req.session.user.isAdmin) {
    res.status(403).json({
      message: "Accès refusé. Privilèges administrateur requis.",
      code: "ADMIN_PRIVILEGES_REQUIRED",
    });
    return;
  }

  // Attacher l'utilisateur à la requête pour usage ultérieur
  req.user = req.session.user;
  next();
}

/**
 * Middleware pour vérifier que l'utilisateur est authentifié (sans vérifier admin)
 * Pour les routes nécessitant seulement une connexion
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.session?.user) {
    res.status(401).json({
      message: "Non authentifié. Connexion requise.",
      code: "AUTHENTICATION_REQUIRED",
    });
    return;
  }

  req.user = req.session.user;
  next();
}
