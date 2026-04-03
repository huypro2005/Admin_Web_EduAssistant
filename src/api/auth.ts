import { getApiBase, ApiError } from "./client";
import {
  clearTokens,
  setTokens,
  type TokenResponse,
} from "../auth/tokens";

export async function login(
  username: string,
  password: string,
): Promise<TokenResponse> {
  const url = `${getApiBase()}/admin/login`;
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!r.ok) {
    const text = await r.text();
    // Reuse a friendly message format from backend if possible.
    // client.ts có hàm messageFromErrorBody nhưng hiện đang private,
    // nên fallback thông điệp trực tiếp khi backend không trả "detail".
    let message = "Đăng nhập thất bại.";
    try {
      const j: unknown = JSON.parse(text);
      if (j && typeof j === "object" && "detail" in j) {
        const d = (j as { detail: unknown }).detail;
        if (typeof d === "string") message = d;
      }
    } catch {
      /* plain text */
    }
    throw new ApiError(r.status, message, text);
  }

  const data = (await r.json()) as TokenResponse;
  setTokens(data);
  return data;
}

export function logout(): void {
  clearTokens();
}

