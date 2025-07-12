import { useIllustrationUrl } from "@/hooks/use-illustration-url";

interface SliderImageProps {
  illustrationKey: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (url: string) => void;
}

export function SliderImage({ 
  illustrationKey, 
  fallbackSrc, 
  alt, 
  className,
  style,
  onClick 
}: SliderImageProps) {
  const { url, isLoading } = useIllustrationUrl(illustrationKey, fallbackSrc);

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className || ''}`}
        style={style}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      onClick={() => url && onClick?.(url)}
    />
  );
}
