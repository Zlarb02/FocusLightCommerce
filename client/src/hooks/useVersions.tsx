import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ThemeDecoration } from "../../../shared/schema";

// Types pour les versions du site
interface SiteVersionData {
  id: number;
  themeDecoration: ThemeDecoration;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hook personnalisé pour gérer les versions du site
export const useVersions = () => {
  const queryClient = useQueryClient();

  // État pour suivre les versions en cours de création/modification
  const [currentVersion, setCurrentVersion] =
    useState<Partial<SiteVersionData> | null>(null);

  // Récupérer la version active
  const { data: activeVersion, isPending: isLoadingActiveVersion } = useQuery({
    queryKey: ["activeVersion"],
    queryFn: async () => {
      const response = await apiRequest<SiteVersionData>(
        "GET",
        "/api/versions"
      );
      return response;
    },
    enabled: true,
  });

  // Récupérer toutes les versions
  const { data: allVersions, isPending: isLoadingAllVersions } = useQuery({
    queryKey: ["allVersions"],
    queryFn: async () => {
      const response = await apiRequest<SiteVersionData[]>(
        "GET",
        "/api/versions/all"
      );
      return response;
    },
    enabled: false, // Désactivé pour éviter les erreurs 403 dans les logs
  });

  // Mutation pour mettre à jour la décoration thématique
  const { mutate: setThemeDecoration, isPending: isUpdatingThemeDecoration } =
    useMutation({
      mutationFn: async (decoration: ThemeDecoration) => {
        return apiRequest<void>("PUT", "/api/versions/theme-decoration", {
          decoration,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activeVersion"] });
        queryClient.invalidateQueries({ queryKey: ["allVersions"] });
      },
    });

  // Mutation pour créer une nouvelle version
  const { mutate: createVersion, isPending: isCreatingVersion } = useMutation({
    mutationFn: async (
      versionData: Omit<SiteVersionData, "id" | "createdAt" | "updatedAt">
    ) => {
      return apiRequest<SiteVersionData>("PUT", "/api/versions", versionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeVersion"] });
      queryClient.invalidateQueries({ queryKey: ["allVersions"] });
      setCurrentVersion(null);
    },
  });

  // Mutation pour mettre à jour une version existante
  const { mutate: updateVersion, isPending: isUpdatingVersion } = useMutation({
    mutationFn: async (
      versionData: Partial<SiteVersionData> & { id: number }
    ) => {
      return apiRequest<SiteVersionData>("PUT", "/api/versions", versionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeVersion"] });
      queryClient.invalidateQueries({ queryKey: ["allVersions"] });
      setCurrentVersion(null);
    },
  });

  // Fonction pour activer une version spécifique
  const activateVersion = (id: number) => {
    updateVersion({ id, isActive: true });
  };

  return {
    activeVersion,
    allVersions,
    isLoading: isLoadingActiveVersion || isLoadingAllVersions,
    isUpdating:
      isUpdatingThemeDecoration ||
      isCreatingVersion ||
      isUpdatingVersion,
    setThemeDecoration,
    createVersion,
    updateVersion,
    activateVersion,
    currentVersion,
    setCurrentVersion,
  };
};

export default useVersions;
