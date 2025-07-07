import React from "react";
import { X } from "lucide-react";

type ImageModalProps = {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
};

export function ImageModal({ open, onClose, imageUrl, alt }: ImageModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate fade-in">
      <button
        className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition z-50"
        onClick={onClose}
        title="Fermer"
        aria-label="Fermer"
      >
        <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>
      <img
        src={imageUrl}
        alt={alt || "Image grand format"}
        className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white dark:border-gray-900 animate fade-in"
        onClick={onClose}
        style={{ cursor: "zoom-out" }}
        draggable={false}
      />
    </div>
  );
}
