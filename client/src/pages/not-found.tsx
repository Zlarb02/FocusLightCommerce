import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-alto-brown/5 dark:bg-alto-cream/5">
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-alto-cream/5 border-alto-brown/15 dark:border-alto-cream/15">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-alto-brown dark:text-alto-cream">
              {t("error.404.title")}
            </h1>
          </div>

          <p className="mt-4 text-sm text-alto-brown/70 dark:text-alto-cream/80">
            {t("error.404.message")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
