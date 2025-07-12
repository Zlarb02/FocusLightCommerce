import { DynamicImage } from "./DynamicImage";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

interface ImageWithFallback {
  key: string;
  fallback: string;
}

interface GalleryProps {
  images: ImageWithFallback[];
  title: string;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onImageClick: (fallbackUrl: string) => void;
}

export function CustomCreationGallery({
  images,
  title,
  currentIndex,
  onIndexChange,
  onImageClick,
}: GalleryProps) {
  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="relative group">
      <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700">
        <DynamicImage
          illustrationKey={currentImage.key}
          fallbackSrc={currentImage.fallback}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(currentImage.fallback)}
        />

        {/* Overlay pour indiquer que c'est cliquable */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100">
            <Maximize2 className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicateurs */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
