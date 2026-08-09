import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface AdminIndustryStat {
  value: string;
  label: string;
  source: string;
  displayOrder: number;
}

export interface AdminIndustry {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  stats: AdminIndustryStat[];
}

export interface IndustryFormPayload {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  stats: AdminIndustryStat[];
}

const INDUSTRIES_BASE_API_URL = `${API_BASE_URL}/industries`;
export const INDUSTRIES_ADMIN_API_URL = `${INDUSTRIES_BASE_API_URL}/admin`;

export async function fetchAdminIndustries() {
  const res = await adminFetch(INDUSTRIES_ADMIN_API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch industries: ${res.status}`);
  }
  return res.json() as Promise<AdminIndustry[]>;
}

export async function createIndustry(payload: IndustryFormPayload) {
  const res = await adminFetch(INDUSTRIES_BASE_API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create industry: ${res.status}`);
  }
  return res.json() as Promise<string>;
}

export async function updateIndustry(id: string, payload: IndustryFormPayload) {
  const res = await adminFetch(`${INDUSTRIES_BASE_API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update industry: ${res.status}`);
  }
}

export async function deleteIndustry(id: string) {
  const res = await adminFetch(`${INDUSTRIES_BASE_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete industry: ${res.status}`);
  }
}
