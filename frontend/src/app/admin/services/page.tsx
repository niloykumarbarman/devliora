"use client";

import { Layers } from "lucide-react";
import AdminResourcePage, {
  type FieldConfig,
  type ColumnConfig,
} from "@/components/admin/AdminResourcePage";
import {
  fetchAdminServices,
  createService,
  updateService,
  deleteService,
  type AdminService,
  type ServiceFormPayload,
} from "@/lib/adminServices";

const emptyForm: ServiceFormPayload = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  includes: [],
  iconUrl: "",
  heroImageUrl: "",
  displayOrder: 0,
  isActive: true,
  highlights: [],
};

const fields: FieldConfig<ServiceFormPayload>[] = [
  { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
  { key: "slug", label: "Slug", type: "text", required: true },
  { key: "iconUrl", label: "Icon URL", type: "image" },
  {
    key: "heroImageUrl",
    label: "Hero Image (detail page banner)",
    type: "image",
    colSpan: 2,
  },
  { key: "displayOrder", label: "Display Order", type: "number" },
  { key: "isActive", label: "Active", type: "checkbox" },
  {
    key: "shortDescription",
    label: "Short Description",
    type: "textarea",
    required: true,
    colSpan: 2,
  },
  {
    key: "fullDescription",
    label: "Full Description",
    type: "textarea",
    required: true,
    colSpan: 2,
  },
  {
    key: "includes",
    label: "Includes (bullet points)",
    type: "stringlist",
    colSpan: 2,
  },
  {
    key: "highlights",
    label: "Highlights (at-a-glance stats)",
    type: "list",
    colSpan: 2,
    listItemLabel: "Highlight",
    listItemFields: [
      { key: "label", label: "Label", type: "text", placeholder: "e.g. 21+ Years of Design Expertise" },
      { key: "description", label: "Description", type: "text", placeholder: "e.g. Decades of experience crafting impactful designs." },
      { key: "displayOrder", label: "Order", type: "number" },
    ],
  },
];

const columns: ColumnConfig<AdminService>[] = [
  { key: "title", label: "Title" },
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

export default function AdminServicesPage() {
  return (
    <AdminResourcePage<AdminService, ServiceFormPayload>
      routePath="/admin/services"
      title="Services"
      itemLabel="Service"
      emptyForm={emptyForm}
      fields={fields}
      columns={columns}
      emptyIcon={Layers}
      emptyMessage="No services yet. Create your first service to get started."
      fetchAll={fetchAdminServices}
      create={createService}
      update={updateService}
      remove={deleteService}
      toForm={(item) => ({
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        includes: item.includes,
        iconUrl: item.iconUrl,
        heroImageUrl: item.heroImageUrl,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        highlights: item.highlights,
      })}
    />
  );
}
