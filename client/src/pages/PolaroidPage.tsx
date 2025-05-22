import { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PolaroidPageProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  description: string | ReactNode;
  additionalContent?: ReactNode;
  date?: string;
}

export default function PolaroidPage({
  title,
  subtitle,
  imagePath,
  description,
  additionalContent,
  date,
}: PolaroidPageProps) {
  return (
    <Layout showCart={false}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Navigation retour */}
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-gray-600 hover:text-[var(--color-text)] transition">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Retour à l'accueil</span>
            </a>
          </Link>
        </div>

        {/* En-tête */}
        <div className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
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

        {/* Appel à l'action */}
        <div className="text-center mt-12">
          <Button
            className="text-base px-6 py-5"
            onClick={() => window.history.back()}
          >
            Découvrir les autres créations
          </Button>
        </div>
      </div>
    </Layout>
  );
}
