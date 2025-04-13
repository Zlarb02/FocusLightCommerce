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
    ? "https://api.votredomaine.com" // À remplacer par l'URL réelle de votre API en production
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
): Promise<Response> {
  const apiUrl = `${getApiBaseUrl()}${url}`;

  const res = await fetch(apiUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
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
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
