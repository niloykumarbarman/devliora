import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export const UPLOADS_API_URL = `${API_BASE_URL}/uploads`;

interface UploadResponse {
  url: string;
}

// Deliberately does NOT reuse adminFetch: adminFetch forces
// Content-Type: application/json, which breaks multipart/form-data
// uploads (the browser must set its own boundary). Only Authorization
// is attached here, letting fetch set the correct multipart headers.
export async function uploadImage(file: File): Promise<string> {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append("file", file);

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(UPLOADS_API_URL, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    // adminFetch (used for every other admin API call) clears the stored
    // token and redirects to /admin/login on a 401. Uploads deliberately
    // bypass adminFetch (see comment above), so without this they'd fail
    // with an inline "Upload failed: 401" and leave the user stuck on a
    // page that still looks logged in, with every other button silently
    // failing the same way.
    if (res.status === 401) {
      clearAdminToken();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
      throw new Error("Session expired. Redirecting to login...");
    }

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
