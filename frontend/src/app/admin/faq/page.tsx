"use client";

import { HelpCircle } from "lucide-react";
import AdminResourcePage, {
  type FieldConfig,
  type ColumnConfig,
} from "@/components/admin/AdminResourcePage";
import {
  fetchAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  type AdminFaq,
  type FaqFormPayload,
} from "@/lib/adminFaq";

const emptyForm: FaqFormPayload = {
  question: "",
  answer: "",
  displayOrder: 0,
  isActive: true,
  serviceSlug: "",
};

const fields: FieldConfig<FaqFormPayload>[] = [
  {
    key: "question",
    label: "Question",
    type: "text",
    required: true,
    colSpan: 2,
  },
  {
    key: "answer",
    label: "Answer",
    type: "textarea",
    required: true,
    colSpan: 2,
  },
  { key: "displayOrder", label: "Display Order", type: "number" },
  { key: "isActive", label: "Active", type: "checkbox" },
  {
    key: "serviceSlug",
    label: "Service Slug (optional)",
    type: "text",
    colSpan: 2,
    placeholder:
      "Leave blank for the homepage's site-wide FAQ. Set to a service's slug (e.g. ai-development) to show this only on that service's page instead.",
  },
];

const columns: ColumnConfig<AdminFaq>[] = [
  { key: "question", label: "Question" },
  { key: "displayOrder", label: "Order" },
  {
    key: "serviceSlug",
    label: "Scope",
    render: (item) => (
      <span className="font-mono text-xs text-graphite/60">
        {item.serviceSlug ? item.serviceSlug : "Site-wide"}
      </span>
    ),
  },
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

export default function AdminFaqPage() {
  return (
    <AdminResourcePage<AdminFaq, FaqFormPayload>
      routePath="/admin/faq"
      title="FAQ"
      itemLabel="FAQ"
      emptyForm={emptyForm}
      fields={fields}
      columns={columns}
      emptyIcon={HelpCircle}
      emptyMessage="No FAQs yet. Create your first FAQ to get started."
      fetchAll={fetchAdminFaqs}
      create={createFaq}
      update={updateFaq}
      remove={deleteFaq}
      toForm={(item) => ({
        question: item.question,
        answer: item.answer,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        serviceSlug: item.serviceSlug,
      })}
    />
  );
}
