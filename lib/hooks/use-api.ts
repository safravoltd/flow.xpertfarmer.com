"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import type { ApiError } from "../types/api";

export function useApi() {
  const { data: session } = useSession();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {},
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        const token = (session?.user as any)?.token;
        if (session?.user && token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            ...options,
            headers,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Log 401 errors but don't auto-logout to prevent loops
          if (response.status === 401) {
            console.warn("[API] Unauthorized - check token validity");
          }

          const apiError: ApiError = {
            message: errorData.message || response.statusText,
            code: response.status.toString(),
            details: errorData,
          };
          setError(apiError);
          return null;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const apiError: ApiError = {
          message: err instanceof Error ? err.message : "Unknown error",
        };
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  const get = useCallback(
    async <T>(endpoint: string): Promise<T | null> => {
      return request<T>(endpoint, { method: "GET" });
    },
    [request],
  );

  const post = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      return request<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    [request],
  );

  const put = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      return request<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    [request],
  );

  const patch = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      return request<T>(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    [request],
  );

  const del = useCallback(
    async <T>(endpoint: string): Promise<T | null> => {
      return request<T>(endpoint, { method: "DELETE" });
    },
    [request],
  );

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    error,
    loading,
  };
}
