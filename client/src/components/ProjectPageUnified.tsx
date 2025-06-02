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
      {/* En-tête style journal */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-16 text-center border-b border-gray-200 pb-12">
          <div className="mb-6">
            {date && (
              <time className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {date}
              </time>
            )}
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        {/* Image principale avec effet polaroid moderne */}
        <figure className="mb-16 flex justify-center">
          <div className="relative group">
            <div className="bg-white p-6 shadow-2xl max-w-4xl w-full transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
              <img
                src={imagePath}
                alt={title}
                className="w-full h-auto transition-all duration-300"
                style={{ aspectRatio: "4/3", objectFit: "cover" }}
              />
              <div className="h-16 flex items-center justify-center">
                <figcaption className="text-sm text-gray-400 font-medium tracking-wide">
                  {title}
                </figcaption>
              </div>
            </div>
          </div>
        </figure>

        {/* Description style article */}
        <section className="prose prose-xl max-w-none mx-auto mb-16">
          <div className="text-gray-800 leading-[1.8] font-light text-xl space-y-6">
            {typeof description === "string" ? (
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                {description}
              </p>
            ) : (
              <div className="space-y-6">{description}</div>
            )}
          </div>
        </section>

        {/* Image répétée pour illustrer */}
        <figure className="mb-16 flex justify-center">
          <div className="relative">
            <div className="bg-white p-4 shadow-lg max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.01]">
              <img
                src={imagePath}
                alt={`${title} - Vue détaillée`}
                className="w-full h-auto"
                style={{ aspectRatio: "16/10", objectFit: "cover" }}
              />
              <div className="h-10" />
            </div>
          </div>
        </figure>

        {/* Contenu supplémentaire avec style journal */}
        {additionalContent && (
          <section className="mb-16">
            <div className="prose prose-xl max-w-none mx-auto text-gray-800 leading-relaxed">
              {additionalContent}
            </div>

            {/* Autre image pour illustration */}
            <figure className="mt-12 flex justify-center">
              <div className="relative">
                <div className="bg-white p-4 shadow-lg max-w-3xl w-full transform transition-all duration-300 hover:scale-[1.01]">
                  <img
                    src={imagePath}
                    alt={`${title} - Processus de création`}
                    className="w-full h-auto"
                    style={{ aspectRatio: "4/3", objectFit: "cover" }}
                  />
                  <div className="h-10" />
                </div>
              </div>
            </figure>
          </section>
        )}

        {/* Navigation et conclusion */}
        <footer className="text-center mt-20 pt-12 border-t border-gray-200">
          <div className="mb-8">
            <p className="text-gray-600 font-light text-lg leading-relaxed max-w-2xl mx-auto">
              Découvrez d'autres créations et projets dans notre boutique en
              ligne.
            </p>
          </div>
          <Link to="/shop">
            <Button
              variant="outline"
              className="text-lg px-8 py-4 font-medium transition-all duration-300 hover:bg-gray-900 hover:text-white border-2"
              style={{ fontFamily: "var(--font-buttons)" }}
            >
              Découvrir le shop
            </Button>
          </Link>
        </footer>
      </article>
    </ProjectLayoutUnified>
  );
}
