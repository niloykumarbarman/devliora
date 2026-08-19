"use client";

import { Code2 } from "lucide-react";
import AdminResourcePage, {
  type FieldConfig,
  type ColumnConfig,
} from "@/components/admin/AdminResourcePage";
import {
  fetchAdminTechnologyDetailPages,
  createTechnologyDetailPage,
  updateTechnologyDetailPage,
  deleteTechnologyDetailPage,
  type AdminTechnologyDetailPage,
  type TechnologyDetailPageFormPayload,
} from "@/lib/adminTechnologyDetailPages";

const emptyForm: TechnologyDetailPageFormPayload = {
  slug: "",
  technologyName: "",
  metaDescription: "",
  displayOrder: 0,
  heroTitle: "",
  heroImageUrl: "",
  overviewHeading: "",
  overviewHeadingAccent: "",
  overviewParagraph: "",
  highlightHeadline: "",
  highlightParagraph: "",
  industriesParagraph: "",
  industriesImageUrl: "",
  servicesHeading: "",
  servicesCardLabel: "",
  servicesParagraph: "",
  servicesCardImageUrl: "",
  features: [],
  faqs: [],
  services: [],
};

const columns: ColumnConfig<AdminTechnologyDetailPage>[] = [
  { key: "technologyName", label: "Technology" },
  { key: "slug", label: "Slug" },
  { key: "heroTitle", label: "Hero title" },
  { key: "displayOrder", label: "Order" },
];

const fields: FieldConfig<TechnologyDetailPageFormPayload>[] = [
  { key: "technologyName", label: "Technology Name", type: "text", required: true, placeholder: "e.g. Java" },
  {
    key: "slug",
    label: "Slug",
    type: "text",
    required: true,
    placeholder: "e.g. java-development",
  },
  { key: "displayOrder", label: "Display Order", type: "number" },
  {
    key: "heroTitle",
    label: "Hero Title",
    type: "text",
    required: true,
    colSpan: 2,
    placeholder: "e.g. Java Development",
  },
  {
    key: "heroImageUrl",
    label: "Hero Banner Image (optional — falls back to the shared Settings image)",
    type: "image",
    colSpan: 2,
  },
  { key: "metaDescription", label: "Meta Description (SEO)", type: "textarea", colSpan: 2 },

  { key: "overviewHeading", label: "Overview Heading", type: "text" },
  { key: "overviewHeadingAccent", label: "Overview Heading Accent", type: "text" },
  {
    key: "overviewParagraph",
    label: "Overview Paragraph",
    type: "textarea",
    colSpan: 2,
  },

  { key: "highlightHeadline", label: "Highlight Headline (optional)", type: "text" },
  {
    key: "highlightParagraph",
    label: "Highlight Paragraph (optional)",
    type: "textarea",
  },

  {
    key: "industriesParagraph",
    label: "Industries & Verticals Paragraph",
    type: "textarea",
    colSpan: 2,
  },
  {
    key: "industriesImageUrl",
    label: "Industries & Verticals Image (optional — falls back to the shared Settings image)",
    type: "image",
    colSpan: 2,
  },

  { key: "servicesHeading", label: "Services Heading", type: "text" },
  { key: "servicesCardLabel", label: "Services Card Label", type: "text" },
  {
    key: "servicesParagraph",
    label: "Services Paragraph",
    type: "textarea",
    colSpan: 2,
  },
  {
    key: "servicesCardImageUrl",
    label: "Services Card Image (optional — falls back to a coded gradient/mockup)",
    type: "image",
    colSpan: 2,
  },

  {
    key: "features",
    label: "Feature Grid",
    type: "list",
    colSpan: 2,
    listItemLabel: "Feature",
    listItemFields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "displayOrder", label: "Order", type: "number" },
    ],
  },
  {
    key: "faqs",
    label: "FAQ",
    type: "list",
    colSpan: 2,
    listItemLabel: "Question",
    listItemFields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "displayOrder", label: "Order", type: "number" },
    ],
  },
  {
    key: "services",
    label: "Development Services Cards",
    type: "list",
    colSpan: 2,
    listItemLabel: "Service",
    listItemFields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "displayOrder", label: "Order", type: "number" },
    ],
  },
];

export default function AdminTechnologyDetailPagesPage() {
  return (
    <AdminResourcePage<AdminTechnologyDetailPage, TechnologyDetailPageFormPayload>
      routePath="/admin/technology-detail-pages"
      title="Technology Detail Pages"
      itemLabel="Page"
      emptyForm={emptyForm}
      fields={fields}
      columns={columns}
      emptyIcon={Code2}
      emptyMessage="No technology detail pages yet. Create one to publish it at /technologies/<slug>."
      editNote="Live at /technologies/<slug> as soon as you save. Card gradient/icon and any custom visual (e.g. a code-editor mockup) are set in code per slug, not here."
      fetchAll={fetchAdminTechnologyDetailPages}
      create={createTechnologyDetailPage}
      update={updateTechnologyDetailPage}
      remove={deleteTechnologyDetailPage}
      toForm={(item) => ({
        slug: item.slug,
        technologyName: item.technologyName,
        metaDescription: item.metaDescription,
        displayOrder: item.displayOrder,
        heroTitle: item.heroTitle,
        heroImageUrl: item.heroImageUrl,
        overviewHeading: item.overviewHeading,
        overviewHeadingAccent: item.overviewHeadingAccent,
        overviewParagraph: item.overviewParagraph,
        highlightHeadline: item.highlightHeadline,
        highlightParagraph: item.highlightParagraph,
        industriesParagraph: item.industriesParagraph,
        industriesImageUrl: item.industriesImageUrl,
        servicesHeading: item.servicesHeading,
        servicesCardLabel: item.servicesCardLabel,
        servicesParagraph: item.servicesParagraph,
        servicesCardImageUrl: item.servicesCardImageUrl,
        features: item.features,
        faqs: item.faqs,
        services: item.services,
      })}
    />
  );
}
