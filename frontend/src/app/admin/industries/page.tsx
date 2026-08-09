"use client";

import { Building2 } from "lucide-react";
import AdminResourcePage, {
  type FieldConfig,
  type ColumnConfig,
} from "@/components/admin/AdminResourcePage";
import {
  fetchAdminIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  type AdminIndustry,
  type IndustryFormPayload,
} from "@/lib/adminIndustries";

const emptyForm: IndustryFormPayload = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 0,
  isActive: true,
  stats: [],
};

const fields: FieldConfig<IndustryFormPayload>[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. fintech" },
  { key: "displayOrder", label: "Display Order", type: "number" },
  { key: "isActive", label: "Active", type: "checkbox" },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    colSpan: 2,
    placeholder: "Shown as the intro paragraph on this industry's page.",
  },
  {
    key: "stats",
    label: "Stats",
    type: "list",
    colSpan: 2,
    listItemLabel: "Stat",
    listItemFields: [
      { key: "value", label: "Value", type: "text", placeholder: "e.g. 99.95%" },
      { key: "label", label: "Label", type: "text", placeholder: "e.g. uptime target" },
      { key: "source", label: "Source", type: "text", placeholder: "e.g. Internal SLA (optional)" },
      { key: "displayOrder", label: "Order", type: "number" },
    ],
  },
];

const columns: ColumnConfig<AdminIndustry>[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "displayOrder", label: "Order" },
  {
    key: "isActive",
    label: "Status",
    render: (item) => (
      <span
        className={
          item.isActive
            ? "rounded-full bg-signal/10 px-2 py-1 text-xs font-medium text-signal"
            : "rounded-full bg-graphite/10 px-2 py-1 text-xs font-medium text-graphite/50"
        }
      >
        {item.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function AdminIndustriesPage() {
  return (
    <AdminResourcePage<AdminIndustry, IndustryFormPayload>
      routePath="/admin/industries"
      title="Industries"
      itemLabel="Industry"
      emptyForm={emptyForm}
      fields={fields}
      columns={columns}
      emptyIcon={Building2}
      emptyMessage="No industries yet. Create your first industry to get started."
      fetchAll={fetchAdminIndustries}
      create={createIndustry}
      update={updateIndustry}
      remove={deleteIndustry}
      toForm={(item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        stats: item.stats,
      })}
    />
  );
}
