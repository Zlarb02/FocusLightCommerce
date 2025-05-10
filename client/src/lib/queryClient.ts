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

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
) {
  const apiUrl = `${getApiBaseUrl()}${url}`;

  const res = await fetch(apiUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);

  // Vérifier s'il y a du contenu avant de faire .json()
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
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
    },
  },
});
