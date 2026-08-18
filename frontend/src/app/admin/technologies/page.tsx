"use client";

import { Cpu } from "lucide-react";
import AdminResourcePage, {
  type FieldConfig,
  type ColumnConfig,
} from "@/components/admin/AdminResourcePage";
import {
  fetchAdminTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  type AdminTechnology,
  type TechnologyFormPayload,
} from "@/lib/adminTechnologies";

const CATEGORY_LABELS: Record<number, string> = {
  0: "Backend & APIs",
  1: "Frontend & UI",
  2: "Cloud & Infrastructure",
  3: "Databases & Caching",
  4: "DevOps & CI/CD",
  5: "AI, ML & Data",
};

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value: Number(value),
  label,
}));

const emptyForm: TechnologyFormPayload = {
  name: "",
  displayName: "",
  category: 0,
  displayOrder: 0,
  isActive: true,
  frameworks: "",
};

const fields: FieldConfig<TechnologyFormPayload>[] = [
  { key: "name", label: "Name", type: "text", required: true, colSpan: 2 },
  { key: "displayName", label: "Display Caption", type: "text", required: true, colSpan: 2 },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    options: categoryOptions,
  },
  { key: "displayOrder", label: "Display Order", type: "number" },
  { key: "isActive", label: "Active", type: "checkbox" },
  {
    key: "frameworks",
    label: "Related Frameworks/Tools (comma-separated, shown on /technologies)",
    type: "text",
    colSpan: 2,
    placeholder: "e.g. Django, FastAPI, Flask, Celery",
  },
];

const columns: ColumnConfig<AdminTechnology>[] = [
  { key: "name", label: "Name" },
  {
    key: "category",
    label: "Category",
    render: (item) => CATEGORY_LABELS[item.category] ?? "Unknown",
  },
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

export default function AdminTechnologiesPage() {
  return (
    <AdminResourcePage<AdminTechnology, TechnologyFormPayload>
      routePath="/admin/technologies"
      title="Technologies"
      itemLabel="Technology"
      emptyForm={emptyForm}
      fields={fields}
      columns={columns}
      emptyIcon={Cpu}
      emptyMessage="No technologies yet. Create your first technology to get started."
      fetchAll={fetchAdminTechnologies}
      create={createTechnology}
      update={updateTechnology}
      remove={deleteTechnology}
      toForm={(item) => ({
        name: item.name,
        displayName: item.displayName,
        category: item.category,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        frameworks: item.frameworks,
      })}
    />
  );
}
