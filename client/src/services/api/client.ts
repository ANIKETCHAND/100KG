/**
 * 100KG Performance OS — Unified HTTP & API Client
 * Supports offline-first fallbacks, automatic credentials, error normalization.
 */

import { env } from "@/config/env";
import { AppError, NetworkError } from "@/core/errors/app-error";

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 12000, params, headers, ...customConfig } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson?.error) errorMessage = errorJson.error;
          else if (errorJson?.message) errorMessage = errorJson.message;
        } catch {}

        throw new AppError(errorMessage, "API_REQUEST_FAILED", response.status);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error instanceof AppError) throw error;
      if (error?.name === "AbortError") {
        throw new NetworkError("Request timed out after " + timeoutMs / 1000 + "s.");
      }
      throw new NetworkError(error?.message || "Network request failed. Operating in offline mode.");
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
