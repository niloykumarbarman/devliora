import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface AdminTechnology {
  id: string;
  name: string;
  displayName: string;
  category: number;
  displayOrder: number;
  isActive: boolean;
  frameworks: string;
}

export interface TechnologyFormPayload {
  name: string;
  displayName: string;
  category: number;
  displayOrder: number;
  isActive: boolean;
  frameworks: string;
}

const TECHNOLOGIES_BASE_API_URL = `${API_BASE_URL}/technologies`;
export const TECHNOLOGIES_ADMIN_API_URL = `${TECHNOLOGIES_BASE_API_URL}/admin`;

export async function fetchAdminTechnologies() {
  const res = await adminFetch(TECHNOLOGIES_ADMIN_API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch technologies: ${res.status}`);
  }
  return res.json() as Promise<AdminTechnology[]>;
}

export async function createTechnology(payload: TechnologyFormPayload) {
  const res = await adminFetch(TECHNOLOGIES_BASE_API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create technology: ${res.status}`);
  }
  return res.json() as Promise<string>;
}

export async function updateTechnology(id: string, payload: TechnologyFormPayload) {
  const res = await adminFetch(`${TECHNOLOGIES_BASE_API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update technology: ${res.status}`);
  }
}

export async function deleteTechnology(id: string) {
  const res = await adminFetch(`${TECHNOLOGIES_BASE_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete technology: ${res.status}`);
  }
}
