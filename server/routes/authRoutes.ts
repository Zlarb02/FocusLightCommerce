import { Router, Request, Response } from "express";
import { storage } from "../storage/index.js";
import { handleError } from "../middleware/middlewares.js";

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const user = await storage.verifyUser(username, password);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Log session avant
    console.log("Session avant login:", req.session);

    req.session.user = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin ?? false,
    };

    // Force la sauvegarde de la session
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Erreur de sauvegarde de session:", err);
          reject(err);
          return;
        }
        console.log("Session après login:", req.session);
        resolve();
      });
    });

    res.json({
      ...req.session.user,
      sessionId: req.session.id,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/logout", (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Could not log out" });
      return;
    }
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/status", (req: Request, res: Response): void => {
  console.log("Session status:", req.session);
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
      sessionId: req.session.id,
    });
  } else {
    console.log("No user in session");
    res.json({
      authenticated: false,
      sessionId: req.session.id,
    });
  }
});

export default router;
