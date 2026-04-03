/**
 * Base URL từ biến môi trường Vite — không hardcode host trong các module API.
 * Ví dụ: VITE_API_BASE=http://127.0.0.1:8000
 */
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../auth/tokens";
import type { TokenResponse } from "../auth/tokens";

export function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE;
  if (!base || typeof base !== "string") {
    throw new Error(
      "Thiếu VITE_API_BASE trong .env (ví dụ: VITE_API_BASE=http://127.0.0.1:8000)",
    );
  }
  return base.replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public rawBody?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function messageFromErrorBody(text: string, status: number): string {
  try {
    const j: unknown = JSON.parse(text);
    if (j && typeof j === "object" && "detail" in j) {
      const d = (j as { detail: unknown }).detail;
      if (typeof d === "string") return d;
      if (Array.isArray(d)) {
        return d
          .map((item) => {
            if (item && typeof item === "object" && "msg" in item) {
              return String((item as { msg: string }).msg);
            }
            return JSON.stringify(item);
          })
          .join("; ");
      }
    }
  } catch {
    /* plain text */
  }
  return text || `HTTP ${status}`;
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /**
   * Nội bộ: điều khiển cơ chế refresh token để tránh lặp vô hạn.
   * Không phải một phần API công khai.
   */
  _auth?: {
    skipRefresh?: boolean;
    _didRefresh?: boolean;
  };
};

function stripNullish(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const mapped = value
      .map((item) => stripNullish(item))
      .filter((item) => item !== undefined);
    return mapped;
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = stripNullish(v);
      if (cleaned !== undefined) {
        out[k] = cleaned;
      }
    }
    return out;
  }

  return value;
}

function logoutAndRedirect(): void {
  clearTokens();
  window.location.href = "/login";
}

async function refreshAccessToken(): Promise<TokenResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, "Không có refresh token.");
  }

  const url = `${getApiBase()}/admin/refresh`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!r.ok) {
    const text = await r.text();
    const msg = messageFromErrorBody(text, r.status);
    throw new ApiError(r.status, msg, text);
  }

  const data = (await r.json()) as TokenResponse;
  setTokens(data);
  return data;
}

/**
 * Wrapper fetch: JSON in/out, ApiError với message đọc được (404, 409, …).
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers: hdrs, _auth, ...rest } = options;
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(hdrs);
  let initBody: BodyInit | undefined;

  // Đính kèm access token (nếu có).
  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (body !== undefined) {
    const cleaned = stripNullish(body);
    headers.set("Content-Type", "application/json");
    initBody = JSON.stringify(cleaned);
  }

  const r = await fetch(url, {
    ...rest,
    headers,
    body: initBody,
  });

  if (r.status === 204) {
    return undefined as T;
  }

  if (!r.ok) {
    const text = await r.text();
    const msg = messageFromErrorBody(text, r.status);
    const apiErr = new ApiError(r.status, msg, text);

    const didRefresh = _auth?._didRefresh === true;
    const skipRefresh = _auth?.skipRefresh === true;
    const isRefreshOrLoginEndpoint =
      path.startsWith("/admin/refresh") ||
      path.startsWith("/admin/login") ||
      path.startsWith("/admin/register");

    if (
      r.status === 401 &&
      !didRefresh &&
      !skipRefresh &&
      !isRefreshOrLoginEndpoint
    ) {
      try {
        await refreshAccessToken();
        return apiRequest<T>(path, {
          ...options,
          _auth: { ...(options._auth ?? {}), _didRefresh: true },
        });
      } catch (e) {
        // refresh_token hết hạn => đăng xuất
        if (e instanceof ApiError && e.status === 401) {
          logoutAndRedirect();
        }
      }
    }

    throw apiErr;
  }

  const ct = r.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return (await r.json()) as T;
  }

  return undefined as T;
}
