import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProjectLayoutUnified from "@/components/ProjectLayoutUnified";

interface ProjectPageUnifiedProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  description: string | ReactNode;
  additionalContent?: ReactNode;
  date?: string;
  currentProject: string;
}

export default function ProjectPageUnified({
  title,
  subtitle,
  imagePath,
  description,
  additionalContent,
  date,
  currentProject,
}: ProjectPageUnifiedProps) {
  return (
    <ProjectLayoutUnified title={title} currentProject={currentProject}>
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-titles)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        )}
        {date && <p className="text-sm text-gray-500 mt-2">{date}</p>}
      </div>

      {/* Image principale avec effet polaroid */}
      <div className="mb-16 flex justify-center">
        <div className="relative bg-white p-4 shadow-lg max-w-3xl w-full transform transition-transform hover:scale-[1.01] duration-300">
          <img
            src={imagePath}
            alt={title}
            className="w-full h-auto"
            style={{ aspectRatio: "4/3", objectFit: "cover" }}
          />
          <div className="h-10" /> {/* Espace blanc du polaroid en bas */}
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-lg max-w-3xl mx-auto mb-12">
        {typeof description === "string" ? (
          <p className="text-gray-700 leading-relaxed">{description}</p>
        ) : (
          description
        )}
      </div>

      {/* Contenu supplémentaire */}
      {additionalContent && (
        <div className="max-w-4xl mx-auto mb-16">{additionalContent}</div>
      )}

      {/* Navigation entre projets */}
      <div className="text-center mt-12">
        <Link to="/shop">
          <Button variant="outline" className="text-base px-6 py-3">
            Découvrir le shop
          </Button>
        </Link>
      </div>
    </ProjectLayoutUnified>
  );
}
