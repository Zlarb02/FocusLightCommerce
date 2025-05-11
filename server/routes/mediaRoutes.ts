import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { storage as dataStorage } from "../storage/index.js";
import { media, Media } from "../../shared/schema.js";
import { isAdmin } from "../middleware/middlewares.js";

const router = express.Router();

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier d'upload en fonction du type de fichier
    let uploadPath = path.join(process.cwd(), "uploads");

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique pour éviter les conflits
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// Filtrer les types de fichiers autorisés
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accepter les images, vidéos et autres fichiers courants
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Vidéos
    "video/mp4",
    "video/webm",
    "video/ogg",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Archives
    "application/zip",
    "application/x-rar-compressed",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
});

// Récupérer tous les médias
router.get("/", async (req: Request, res: Response) => {
  try {
    const allMedia = await dataStorage.getAllMedias();
    res.json(allMedia);
  } catch (error) {
    console.error("Erreur lors de la récupération des médias:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des médias" });
  }
});

// Upload d'un média
router.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Aucun fichier n'a été uploadé" });
      }

      const file = req.file;
      const fileType = req.body.type || determineFileType(file.mimetype);

      // Utiliser un chemin relatif pour plus de flexibilité entre les environnements
      const filePath = `/uploads/${file.filename}`;

      // Créer un nouvel objet média
      const newMedia: Omit<Media, "id"> = {
        filename: file.originalname,
        path: filePath,
        type: fileType as "image" | "video" | "other",
        size: file.size,
        createdAt: new Date().toISOString(),
      };

      // Enregistrer les informations du fichier via le système de stockage
      const savedMedia = await dataStorage.createMedia(newMedia);
      res.status(201).json(savedMedia);
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      res.status(500).json({ message: "Erreur lors de l'upload du fichier" });
    }
  }
);

// Supprimer un média
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const mediaId = parseInt(req.params.id);

    // Récupérer d'abord les informations du média pour trouver le fichier
    const mediaToDelete = await dataStorage.getMediaById(mediaId);

    if (!mediaToDelete) {
      res.status(404).json({ message: "Média non trouvé" });
      return;
    }

    // Supprimer le fichier physique
    try {
      const fileUrl = new URL(mediaToDelete.path);
      const filePath = path.join(process.cwd(), fileUrl.pathname);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn("Erreur lors de la suppression du fichier physique:", e);
      // On continue malgré l'erreur de suppression du fichier
    }

    // Supprimer l'entrée via le système de stockage
    await dataStorage.deleteMedia(mediaId);

    res.json({ message: "Média supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du média:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du média" });
  }
});

// Fonction utilitaire pour déterminer le type de fichier
function determineFileType(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "image";
  } else if (mimetype.startsWith("video/")) {
    return "video";
  } else {
    return "other";
  }
}

export default router;
