import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface Illustration {
  key: string;
  url: string;
  title: string;
  description?: string;
  pages?: string[];
  category?: string;
}

export interface IllustrationEntry {
  key: string;
  url: string;
  title: string;
  description?: string;
  pages?: string[];
  category?: string;
}

export interface PaginatedIllustrationsResponse {
  illustrations: Illustration[];
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Hook pour récupérer les illustrations avec pagination
export function useIllustrations(
  page: number = 1,
  limit: number = 50,
  search: string = "",
  category: string = ""
) {
  return useQuery({
    queryKey: ["/api/illustrations", page, limit, search, category],
    queryFn: async (): Promise<PaginatedIllustrationsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        category,
      });

      const response = await fetch(`/api/illustrations?${params}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des illustrations");
      }

      return response.json();
    },
  });
}

// Hook pour récupérer une illustration spécifique
export function useIllustration(key: string) {
  return useQuery({
    queryKey: ["/api/illustrations", key],
    queryFn: async (): Promise<Illustration> => {
      const response = await fetch(`/api/illustrations/${key}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de l'illustration");
      }

      return response.json();
    },
    enabled: !!key,
  });
}

// Hook pour ajouter une illustration
export function useAddIllustration() {
  return useMutation({
    mutationFn: async (
      data: Omit<IllustrationEntry, "key"> & { key: string }
    ) => {
      const response = await fetch("/api/illustrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de l'ajout de l'illustration"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/illustrations"] });
    },
  });
}

// Hook pour mettre à jour une illustration
export function useUpdateIllustration() {
  return useMutation({
    mutationFn: async ({
      key,
      ...data
    }: { key: string } & Partial<IllustrationEntry>) => {
      const response = await fetch(`/api/illustrations/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de la mise à jour de l'illustration"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/illustrations"] });
    },
  });
}

// Hook pour supprimer une illustration
export function useDeleteIllustration() {
  return useMutation({
    mutationFn: async (key: string) => {
      const response = await fetch(`/api/illustrations/${key}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de la suppression de l'illustration"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/illustrations"] });
    },
  });
}
