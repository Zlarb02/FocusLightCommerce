import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Palette, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import {
  THEME_CONFIG_DEFAULTS,
  type ThemeConfig,
} from "@/hooks/useThemeConfig";

/**
 * /gestion → Paramètres → Apparence.
 *
 * Deux choix que la maquette laisse ouverts et qu'Anatole doit pouvoir trancher
 * lui-même, sans redéploiement.
 */
export default function ApparenceSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ThemeConfig>({
    queryKey: ["/api/theme/config"],
  });

  const [config, setConfig] = useState<ThemeConfig>(THEME_CONFIG_DEFAULTS);

  useEffect(() => {
    if (data) setConfig(data);
  }, [data]);

  const save = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/theme/config", config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/theme/config"] });
      toast({
        title: "Apparence enregistrée",
        description: "Les réglages sont appliqués sur le site.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "L'enregistrement a échoué.",
        variant: "destructive",
      });
    },
  });

  const dirty = data ? JSON.stringify(data) !== JSON.stringify(config) : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" /> Apparence du site
        </CardTitle>
        <CardDescription>
          Deux points que la maquette laisse ambigus. Par défaut, le site suit la
          maquette à la lettre.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-6 border-b pb-6">
          <div className="space-y-1">
            <p className="font-medium">Thème sombre franc</p>
            <p className="text-sm text-muted-foreground">
              Le thème sombre de la maquette a un fond <strong>brun</strong> (la
              couleur de la marque). Activez cette option pour un sombre neutre,
              presque noir, plus proche de ce qu'attendent la plupart des
              visiteurs.
            </p>
          </div>
          <Switch
            checked={config.trueDark}
            disabled={isLoading}
            onCheckedChange={(trueDark) => setConfig((c) => ({ ...c, trueDark }))}
            aria-label="Thème sombre franc"
          />
        </div>

        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <p className="font-medium">
              Footer brun sur Fabrication (ordinateur, thème clair)
            </p>
            <p className="text-sm text-muted-foreground">
              La maquette met un footer <strong>brun</strong> au bas de la page
              Fabrication, sur ordinateur en thème clair uniquement — partout
              ailleurs il est bleu. Désactivez si c'était une étourderie et que
              vous voulez le bleu partout.
            </p>
          </div>
          <Switch
            checked={config.brownFooterOnFabrication}
            disabled={isLoading}
            onCheckedChange={(brownFooterOnFabrication) =>
              setConfig((c) => ({ ...c, brownFooterOnFabrication }))
            }
            aria-label="Footer brun sur Fabrication"
          />
        </div>

        <Button
          onClick={() => save.mutate()}
          disabled={!dirty || save.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {save.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
}
