import { getAdminToken, clearAdminToken, refreshAdminToken } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export const UPLOADS_API_URL = `${API_BASE_URL}/uploads`;

interface UploadResponse {
  url: string;
}

// Deliberately does NOT reuse adminFetch: adminFetch forces
// Content-Type: application/json, which breaks multipart/form-data
// uploads (the browser must set its own boundary). Only Authorization
// is attached here, letting fetch set the correct multipart headers.
async function postUpload(file: File): Promise<Response> {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append("file", file);

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(UPLOADS_API_URL, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });
}

export async function uploadImage(file: File, _isRetry = false): Promise<string> {
  const res = await postUpload(file);

  if (res.status === 401) {
    // Same short-lived-access-token issue adminFetch works around: try a
    // silent refresh once before giving up, so an upload mid-way through
    // a long form doesn't kick the admin out. Only log out and redirect
    // if the refresh token is also missing/expired/revoked.
    if (!_isRetry && (await refreshAdminToken())) {
      return uploadImage(file, true);
    }

    clearAdminToken();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Session expired. Redirecting to login...");
  }

  if (!res.ok) {
    let message = `Upload failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }

  const data: UploadResponse = await res.json();
  return data.url;
}
