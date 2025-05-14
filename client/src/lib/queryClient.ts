import { QueryClient, QueryFunction } from "@tanstack/react-query";

declare global {
  interface Window {
    ENV?: {
      API_URL?: string;
    };
  }
}

// Fonction utilitaire pour obtenir la base URL de l'API
export function getApiBaseUrl() {
  // En développement, utilisez l'URL locale
  // En production, utilisez l'URL de l'API déployée avec Docker
  if (typeof window !== "undefined" && window.ENV && window.ENV.API_URL) {
    return window.ENV.API_URL;
  }
  return process.env.NODE_ENV === "production"
    ? "https://api-focus.pogodev.com" // À remplacer par l'URL réelle de votre API en production
    : "http://localhost:5000";
}

// Configuration par défaut pour les requêtes fetch
const defaultFetchOptions: RequestInit = {
  credentials: "include", // Important pour les cookies cross-domain
  headers: {
    "Content-Type": "application/json",
  },
};

// Fonction pour faire des requêtes API
export async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: unknown,
  options?: { formData: boolean }
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    headers: options?.formData
      ? {} // Ne pas définir le Content-Type pour FormData, le navigateur le fera automatiquement
      : {
          "Content-Type": "application/json",
        },
  };

  if (data) {
    if (options?.formData) {
      fetchOptions.body = data as FormData;
    } else {
      fetchOptions.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Pour les réponses 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const path = queryKey[0] as string;
    const apiUrl = `${getApiBaseUrl()}${path}`;

    const res = await fetch(apiUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
      queryFn: getQueryFn({ on401: "returnNull" }),
    },
  },
});
