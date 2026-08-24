import { API_BASE_URL } from "./apiConfig";
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string | null;
  refreshToken: string | null;
  errorMessage: string | null;
}

export const AUTH_LOGIN_API_URL = `${API_BASE_URL}/auth/login`;

const TOKEN_STORAGE_KEY = "devliora_admin_token";
const REFRESH_TOKEN_STORAGE_KEY = "devliora_admin_refresh_token";
export const AUTH_REFRESH_API_URL = `${API_BASE_URL}/auth/refresh`;

export interface RefreshTokenResponse {
  success: boolean;
  token: string | null;
  refreshToken: string | null;
  errorMessage: string | null;
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(AUTH_LOGIN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: LoginResponse = await res.json();

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data.errorMessage || `Login failed: ${res.status}`);
  }

  return data;
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAdminRefreshToken(refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function getAdminRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  return getAdminToken() !== null;
}

// The access token is short-lived (15min — see backend JwtSettings), and
// a big admin form (e.g. a Technology/Solution Detail Page with 30+
// fields and image uploads) routinely takes longer than that to fill
// out. Without this, adminFetch used to log the admin out and discard
// their in-progress edit the moment the token expired mid-form. This
// dedupes concurrent refreshes (the backend revokes the old refresh
// token on use, so two parallel calls with the same stored token would
// otherwise race and one would fail) into a single in-flight request.
let refreshInFlight: Promise<boolean> | null = null;

export async function refreshAdminToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getAdminRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(AUTH_REFRESH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
        cache: "no-store",
      });
      if (!res.ok) return false;

      const data: RefreshTokenResponse = await res.json();
      if (!data.success || !data.token || !data.refreshToken) return false;

      setAdminToken(data.token);
      setAdminRefreshToken(data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export async function adminFetch(
  input: string,
  init: RequestInit = {},
  _isRetry = false
): Promise<Response> {
  const token = getAdminToken();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401) {
    // Try a silent refresh once before giving up — only log out and
    // redirect if the refresh token is also missing/expired/revoked.
    if (!_isRetry && (await refreshAdminToken())) {
      return adminFetch(input, init, true);
    }

    clearAdminToken();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }

  return res;
}
