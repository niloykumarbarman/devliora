import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface AdminServiceHighlight {
  label: string;
  description: string;
  displayOrder: number;
}

export interface AdminService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  iconUrl: string;
  heroImageUrl: string;
  displayOrder: number;
  isActive: boolean;
  highlights: AdminServiceHighlight[];
}

export interface ServiceFormPayload {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  iconUrl: string;
  heroImageUrl: string;
  displayOrder: number;
  isActive: boolean;
  highlights: AdminServiceHighlight[];
}

export const SERVICES_ADMIN_API_URL = `${API_BASE_URL}/services`;

export async function fetchAdminServices() {
  const res = await adminFetch(`${SERVICES_ADMIN_API_URL}/admin`);
  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.status}`);
  }
  return res.json() as Promise<AdminService[]>;
}

export async function createService(payload: ServiceFormPayload) {
  const res = await adminFetch(SERVICES_ADMIN_API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create service: ${res.status}`);
  }
  return res.json() as Promise<string>;
}

export async function updateService(id: string, payload: ServiceFormPayload) {
  const res = await adminFetch(`${SERVICES_ADMIN_API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update service: ${res.status}`);
  }
}

export async function deleteService(id: string) {
  const res = await adminFetch(`${SERVICES_ADMIN_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete service: ${res.status}`);
  }
}
