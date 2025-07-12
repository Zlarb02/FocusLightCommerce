import { useIllustration } from "@/hooks/use-illustrations";

interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  illustrationKey: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
}

export function DynamicImage({
  illustrationKey,
  fallbackSrc,
  fallbackAlt,
  alt,
  ...props
}: DynamicImageProps) {
  const { data: illustration, isLoading } = useIllustration(illustrationKey);

  if (isLoading) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${
          props.className || ""
        }`}
        style={{ width: props.width, height: props.height }}
      />
    );
  }

  return (
    <img
      {...props}
      src={illustration?.url || fallbackSrc}
      alt={alt || illustration?.description || fallbackAlt}
    />
  );
}
