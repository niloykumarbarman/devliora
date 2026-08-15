"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Trash2, Loader2, RefreshCw, Plus, X, Pencil, Upload, type LucideIcon } from "lucide-react";
import { uploadImage } from "@/lib/adminUploads";
import { resolveImageUrl } from "@/lib/hero";

export interface ListItemFieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "image" | "select";
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

export interface FieldConfig<TForm> {
  key: keyof TForm;
  label: string;
  type: "text" | "textarea" | "checkbox" | "number" | "select" | "list" | "stringlist" | "image";
  required?: boolean;
  colSpan?: 1 | 2;
  placeholder?: string;
  options?: { value: number | string; label: string }[];
  selectValueType?: "number" | "string";
  listItemFields?: ListItemFieldConfig[];
  listItemLabel?: string;
}

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
}

export interface AdminResourcePageProps<T extends { id: string }, TForm> {
  routePath: string;
  title: string;
  itemLabel: string;
  emptyForm: TForm;
  fields: FieldConfig<TForm>[];
  columns: ColumnConfig<T>[];
  emptyIcon: LucideIcon;
  emptyMessage: string;
  fetchAll: () => Promise<T[]>;
  create: (payload: TForm) => Promise<string>;
  update: (id: string, payload: TForm) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toForm: (item: T) => TForm;
  editNote?: string;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-graphite/15 px-3 py-2.5 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/10";
const listInputClass =
  "mt-1 w-full rounded-md border border-graphite/15 px-2 py-1.5 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/10";
const labelClass = "block font-mono text-xs uppercase tracking-wider text-graphite/50";
const listLabelClass = "block font-mono text-[10px] uppercase tracking-wider text-graphite/40";

export default function AdminResourcePage<T extends { id: string }, TForm>({
  routePath,
  title,
  itemLabel,
  emptyForm,
  fields,
  columns,
  emptyIcon: EmptyIcon,
  emptyMessage,
  fetchAll,
  create,
  update,
  remove,
  toForm,
  editNote,
}: AdminResourcePageProps<T, TForm>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${itemLabel.toLowerCase()}s.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (item: T) => {
    setForm(toForm(item));
    setEditingId(item.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await update(editingId, form);
      } else {
        await create(form);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to save ${itemLabel.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${itemLabel.toLowerCase()}.`);
    } finally {
      setDeletingId(null);
    }
  };

  const setFieldValue = (
    key: keyof TForm,
    value: string | boolean | number | string[] | Record<string, string | number>[]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (
    file: File,
    onUploaded: (url: string) => void,
    uploadKey: string
  ) => {
    setUploadingKey(uploadKey);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
            {routePath}
          </span>
          <h1 className="mt-2 text-3xl font-semibold text-graphite">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-graphite/15 bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition hover:border-signal hover:text-signal disabled:opacity-60"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            New {itemLabel}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          {error}
        </div>
      )}

      {showForm && (
        <div className="admin-fade-in mt-8 rounded-xl border border-graphite/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-graphite">
              {editingId ? `Edit ${itemLabel}` : `New ${itemLabel}`}
            </h2>
            <button onClick={closeForm} className="text-graphite/40 transition hover:text-graphite">
              <X className="h-5 w-5" />
            </button>
          </div>

          {editingId && editNote && (
            <p className="mt-2 text-xs text-graphite/50">{editNote}</p>
          )}

          {uploadError && (
            <div className="mt-4 rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
              {uploadError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const value = form[field.key];
              const spanClass = field.colSpan === 2 ? "md:col-span-2" : "";

              if (field.type === "checkbox") {
                return (
                  <div key={String(field.key)} className={`flex items-center gap-2 ${spanClass}`}>
                    <input
                      id={String(field.key)}
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => setFieldValue(field.key, e.target.checked)}
                      className="h-4 w-4 rounded border-graphite/30 text-signal focus:ring-signal/30"
                    />
                    <label htmlFor={String(field.key)} className="text-sm text-graphite">
                      {field.label}
                    </label>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={String(field.key)} className={spanClass}>
                    <label className={labelClass}>{field.label}</label>
                    <textarea
                      required={field.required}
                      rows={3}
                      placeholder={field.placeholder}
                      value={String(value ?? "")}
                      onChange={(e) => setFieldValue(field.key, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                );
              }

              if (field.type === "stringlist") {
                const arr = (Array.isArray(value) ? value : []) as string[];
                return (
                  <div key={String(field.key)} className={spanClass}>
                    <label className={labelClass}>{field.label}</label>
                    <textarea
                      required={field.required}
                      rows={4}
                      placeholder={field.placeholder ?? "One item per line"}
                      value={arr.join("\n")}
                      onChange={(e) =>
                        setFieldValue(
                          field.key,
                          e.target.value.split("\n")
                        )
                      }
                      className={inputClass}
                    />
                    <p className="mt-1 text-[11px] text-graphite/40">One item per line.</p>
                  </div>
                );
              }

              if (field.type === "image") {
                const strValue = String(value ?? "");
                const uploadKey = `field:${String(field.key)}`;
                const isUploading = uploadingKey === uploadKey;
                return (
                  <div key={String(field.key)} className={spanClass}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      type="text"
                      required={field.required}
                      placeholder={field.placeholder ?? "https://... or upload below"}
                      value={strValue}
                      onChange={(e) => setFieldValue(field.key, e.target.value)}
                      className={inputClass}
                    />
                    <div className="mt-2 flex items-center gap-3">
                      {strValue && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(strValue)}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-md border border-graphite/15 object-cover"
                        />
                      )}
                      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-3 py-1.5 text-xs font-medium text-graphite transition hover:border-signal hover:text-signal">
                        {isUploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        {isUploading ? "Uploading..." : "Upload image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            handleImageUpload(
                              file,
                              (url) => setFieldValue(field.key, url),
                              uploadKey
                            );
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={String(field.key)} className={spanClass}>
                    <label className={labelClass}>{field.label}</label>
                    <select
                      required={field.required}
                      value={String(value ?? "")}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setFieldValue(field.key, field.selectValueType === "string" ? raw : Number(raw));
                      }}
                      className={inputClass}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "list") {
                const arr = (Array.isArray(value) ? value : []) as Record<string, string | number>[];
                const itemFields = field.listItemFields ?? [];
                const itemLabelText = field.listItemLabel ?? "Item";

                const addItem = () => {
                  const newItem: Record<string, string | number> = {};
                  itemFields.forEach((f) => {
                    newItem[f.key] =
                      f.type === "number"
                        ? 0
                        : f.type === "select"
                          ? (f.options?.[0]?.value ?? "")
                          : "";
                  });
                  setFieldValue(field.key, [...arr, newItem]);
                };

                const removeItem = (idx: number) => {
                  setFieldValue(field.key, arr.filter((_, i) => i !== idx));
                };

                const updateItem = (idx: number, itemKey: string, itemValue: string | number) => {
                  const next = arr.map((it, i) => (i === idx ? { ...it, [itemKey]: itemValue } : it));
                  setFieldValue(field.key, next);
                };

                return (
                  <div key={String(field.key)} className={spanClass}>
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>{field.label}</label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 text-xs font-medium text-signal transition hover:brightness-110"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add {itemLabelText}
                      </button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {arr.length === 0 && (
                        <p className="text-xs text-graphite/40">No {itemLabelText.toLowerCase()}s yet.</p>
                      )}
                      {arr.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded-lg border border-graphite/10 p-3"
                        >
                          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                            {itemFields.map((f) => {
                              if (f.type === "image") {
                                const itemStrValue = String(item[f.key] ?? "");
                                const itemUploadKey = `list:${String(field.key)}:${idx}:${f.key}`;
                                const isItemUploading = uploadingKey === itemUploadKey;
                                return (
                                  <div key={f.key}>
                                    <label className={listLabelClass}>{f.label}</label>
                                    <input
                                      type="text"
                                      placeholder={f.placeholder}
                                      value={itemStrValue}
                                      onChange={(e) => updateItem(idx, f.key, e.target.value)}
                                      className={listInputClass}
                                    />
                                    <div className="mt-1 flex items-center gap-2">
                                      {itemStrValue && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={resolveImageUrl(itemStrValue)}
                                          alt=""
                                          className="h-8 w-8 shrink-0 rounded border border-graphite/15 object-cover"
                                        />
                                      )}
                                      <label className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-signal transition hover:brightness-110">
                                        {isItemUploading ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Upload className="h-3 w-3" />
                                        )}
                                        {isItemUploading ? "Uploading..." : "Upload"}
                                        <input
                                          type="file"
                                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                          className="hidden"
                                          disabled={isItemUploading}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            e.target.value = "";
                                            if (!file) return;
                                            handleImageUpload(
                                              file,
                                              (url) => updateItem(idx, f.key, url),
                                              itemUploadKey
                                            );
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                );
                              }

                              if (f.type === "select") {
                                return (
                                  <div key={f.key}>
                                    <label className={listLabelClass}>{f.label}</label>
                                    <select
                                      value={String(item[f.key] ?? "")}
                                      onChange={(e) => updateItem(idx, f.key, e.target.value)}
                                      className={listInputClass}
                                    >
                                      {f.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              }

                              return (
                                <div key={f.key}>
                                  <label className={listLabelClass}>{f.label}</label>
                                  <input
                                    type={f.type === "number" ? "number" : "text"}
                                    placeholder={f.placeholder}
                                    value={String(item[f.key] ?? "")}
                                    onChange={(e) =>
                                      updateItem(
                                        idx,
                                        f.key,
                                        f.type === "number" ? Number(e.target.value) : e.target.value
                                      )
                                    }
                                    className={listInputClass}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="mt-5 text-graphite/30 transition hover:text-ember"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={String(field.key)} className={spanClass}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={String(value ?? "")}
                    onChange={(e) =>
                      setFieldValue(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              );
            })}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-graphite/15 px-4 py-2 text-sm text-graphite/70 transition hover:bg-graphite/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:brightness-110 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : `Create ${itemLabel}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-graphite/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading {itemLabel.toLowerCase()}s...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-graphite/15 bg-white/50 py-16 text-center">
          <EmptyIcon className="h-8 w-8 text-graphite/30" />
          <p className="text-graphite/60">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-graphite/10 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-graphite/5 font-mono text-xs uppercase tracking-wider text-graphite/50">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-5 py-4">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-graphite/8 transition hover:bg-graphite/[0.03]">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-5 py-4 text-graphite/70">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditForm(item)}
                        className="text-graphite/30 transition hover:scale-110 hover:text-signal"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {confirmDeleteId === item.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-md bg-ember px-2 py-1 text-xs font-medium text-paper transition hover:brightness-110"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-md border border-graphite/20 px-2 py-1 text-xs text-graphite/60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="text-graphite/30 transition hover:scale-110 hover:text-ember"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
