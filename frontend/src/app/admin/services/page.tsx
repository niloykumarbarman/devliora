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
  toolsHeading: "",
  toolsDescription: "",
  toolsTagline: "",
  toolNames: [],
  processSteps: [],
  processGroupStart: 0,
  processGroupCount: 0,
  processGroupLabel: "",
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
  {
    key: "toolsHeading",
    label: "Tools Section Heading",
    type: "text",
    colSpan: 2,
    placeholder: "e.g. Power up your workflow with DaaS",
  },
  {
    key: "toolsDescription",
    label: "Tools Section Description",
    type: "textarea",
    colSpan: 2,
    placeholder: "e.g. Streamline your creative process with an all-in-one DaaS solution...",
  },
  {
    key: "toolsTagline",
    label: "Tools Section Tagline",
    type: "text",
    colSpan: 2,
    placeholder: "e.g. Instant access to top design tools, expert guidance, and seamless collaboration.",
  },
  {
    key: "toolNames",
    label: "Tool Icons",
    type: "stringlist",
    colSpan: 2,
    placeholder: "One per line — figma, sketch, framer, marvelapp, miro, webflow, rive, abstract, or any other tool name (shows as a text badge if no icon exists)",
  },
  {
    key: "processSteps",
    label: "Process Steps (in order)",
    type: "stringlist",
    colSpan: 2,
    placeholder: "One per line — e.g. UX research, Sketching / brainstorming, Wireframing, Prototyping, Usability testing, Handover & support",
  },
  {
    key: "processGroupStart",
    label: "Iteration Group: Start Step (0-indexed)",
    type: "number",
    placeholder: "e.g. 1 to start at the 2nd step",
  },
  {
    key: "processGroupCount",
    label: "Iteration Group: Step Count",
    type: "number",
    placeholder: "e.g. 4 — set to 0 to hide the dashed box",
  },
  {
    key: "processGroupLabel",
    label: "Iteration Group: Caption",
    type: "text",
    colSpan: 2,
    placeholder: "e.g. Design iteration",
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
        toolsHeading: item.toolsHeading,
        toolsDescription: item.toolsDescription,
        toolsTagline: item.toolsTagline,
        toolNames: item.toolNames,
        processSteps: item.processSteps,
        processGroupStart: item.processGroupStart,
        processGroupCount: item.processGroupCount,
        processGroupLabel: item.processGroupLabel,
      })}
    />
  );
}
