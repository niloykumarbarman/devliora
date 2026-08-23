import type { FieldConfig, ColumnConfig } from "@/components/admin/AdminResourcePage";
import type { AdminTechnologyDetailPage, TechnologyDetailPageFormPayload } from "@/lib/adminTechnologyDetailPages";

// Shared field/column config for both admin surfaces backed by the same
// TechnologyDetailPage table — Technology Pages (/admin/technology-
// detail-pages) and Solution Pages (/admin/solution-detail-pages). Both
// show the same full field set; each page just filters its list by
// pageType and defaults new rows to its own type — see each page.tsx.
export function makeEmptyTechnologyDetailPageForm(
  pageType: "technology" | "solution"
): TechnologyDetailPageFormPayload {
  return {
    slug: "",
    technologyName: "",
    metaDescription: "",
    displayOrder: 0,
    pageType,
    heroTitle: "",
    heroImageUrl: "",
    overviewHeading: "",
    overviewHeadingAccent: "",
    overviewHeadingSuffix: "",
    overviewParagraph: "",
    showTechnologiesShowcase: false,
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
}

export const technologyDetailPageColumns: ColumnConfig<AdminTechnologyDetailPage>[] = [
  { key: "technologyName", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "heroTitle", label: "Hero title" },
  { key: "displayOrder", label: "Order" },
];

export const technologyDetailPageFields: FieldConfig<TechnologyDetailPageFormPayload>[] = [
  { key: "technologyName", label: "Name", type: "text", required: true, placeholder: "e.g. Java, Furniture eCommerce" },
  {
    key: "slug",
    label: "Slug",
    type: "slug",
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
    key: "overviewHeadingSuffix",
    label: "Overview Heading Suffix (optional — text after the accent, e.g. \"Software\")",
    type: "text",
  },
  {
    key: "overviewParagraph",
    label: "Overview Paragraph",
    type: "textarea",
    colSpan: 2,
  },
  {
    key: "showTechnologiesShowcase",
    label: "Show \"Technologies\" logo-cloud section (Devliora's real tech stack)",
    type: "checkbox",
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
    label: "Industries & Verticals Paragraph (optional — leave blank to hide this section)",
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

export function technologyDetailPageToForm(item: AdminTechnologyDetailPage): TechnologyDetailPageFormPayload {
  return {
    slug: item.slug,
    technologyName: item.technologyName,
    metaDescription: item.metaDescription,
    displayOrder: item.displayOrder,
    pageType: item.pageType,
    heroTitle: item.heroTitle,
    heroImageUrl: item.heroImageUrl,
    overviewHeading: item.overviewHeading,
    overviewHeadingAccent: item.overviewHeadingAccent,
    overviewHeadingSuffix: item.overviewHeadingSuffix,
    overviewParagraph: item.overviewParagraph,
    showTechnologiesShowcase: item.showTechnologiesShowcase,
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
  };
}
