import { useIllustration } from "@/hooks/use-illustrations";

export function useIllustrationUrl(key: string, fallbackUrl?: string) {
  const { data: illustration, isLoading } = useIllustration(key);

  return {
    url: illustration?.url || fallbackUrl,
    alt: illustration?.description,
    isLoading,
  };
}
