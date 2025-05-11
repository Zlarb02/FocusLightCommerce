import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Middleware qui vérifie si l'utilisateur est authentifié
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) return next();
  res.status(401).json({ message: "Unauthorized" });
};

/**
 * Middleware qui vérifie si l'utilisateur est administrateur
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.isAdmin) return next();
  res.status(403).json({ message: "Forbidden: Administrator access required" });
};

/**
 * Gestionnaire d'erreurs centralisé
 */
export const handleError = (res: Response, error: unknown) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: error.errors });
    return;
  }
  res.status(500).json({
    message: error instanceof Error ? error.message : "Unknown error",
  });
};

/**
 * Middleware CORS (désactivé car géré dans vite.ts)
 */
export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ce middleware n'est plus utilisé car CORS est géré dans vite.ts
  next();
};
