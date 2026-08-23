"use client";

import { Package } from "lucide-react";
import AdminResourcePage from "@/components/admin/AdminResourcePage";
import {
  fetchAdminSolutionDetailPages,
  createTechnologyDetailPage,
  updateTechnologyDetailPage,
  deleteTechnologyDetailPage,
  type AdminTechnologyDetailPage,
  type TechnologyDetailPageFormPayload,
} from "@/lib/adminTechnologyDetailPages";
import {
  makeEmptyTechnologyDetailPageForm,
  technologyDetailPageColumns,
  technologyDetailPageFields,
  technologyDetailPageToForm,
} from "@/lib/technologyDetailPageAdminFields";

// Backed by the same TechnologyDetailPage table as
// /admin/technology-detail-pages — this screen only lists/creates rows
// with pageType "solution" (fetchAdminSolutionDetailPages filters
// client-side), rendered at /solutions/<slug> instead of
// /technologies/<slug>.
export default function AdminSolutionDetailPagesPage() {
  return (
    <AdminResourcePage<AdminTechnologyDetailPage, TechnologyDetailPageFormPayload>
      routePath="/admin/solution-detail-pages"
      title="Solution Detail Pages"
      itemLabel="Page"
      emptyForm={makeEmptyTechnologyDetailPageForm("solution")}
      fields={technologyDetailPageFields}
      columns={technologyDetailPageColumns}
      emptyIcon={Package}
      emptyMessage="No solution detail pages yet. Create one to publish it at /solutions/<slug>."
      editNote="Live at /solutions/<slug> as soon as you save. Card gradient and the Highlight section's icon are set in code per slug, not here."
      fetchAll={fetchAdminSolutionDetailPages}
      create={createTechnologyDetailPage}
      update={updateTechnologyDetailPage}
      remove={deleteTechnologyDetailPage}
      toForm={technologyDetailPageToForm}
    />
  );
}
