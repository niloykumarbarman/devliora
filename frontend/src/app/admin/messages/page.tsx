"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, RefreshCw, Inbox } from "lucide-react";
import {
  fetchAdminContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  CONTACT_MESSAGE_STATUS_OPTIONS,
  type AdminContactMessage,
  type ContactMessageStatus,
} from "@/lib/adminContactMessages";

const STATUS_STYLES: Record<string, string> = {
  New: "bg-signal/10 text-signal border-signal/20",
  InProgress: "bg-ember/10 text-ember border-ember/20",
  Resolved: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
  Spam: "bg-graphite/10 text-graphite/50 border-graphite/20",
};

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminContactMessages();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: ContactMessageStatus) => {
    setUpdatingId(id);
    setError("");
    try {
      await updateContactMessageStatus(id, status);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteContactMessage(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact message.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
            /admin/messages
          </span>
          <h1 className="mt-2 text-3xl font-semibold text-graphite">Contact Messages</h1>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-graphite/15 bg-white px-4 py-2 text-sm font-medium text-graphite shadow-sm transition hover:border-signal hover:text-signal disabled:opacity-60"
        >
          <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-graphite/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading contact messages...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-graphite/15 bg-white/50 py-16 text-center">
          <Inbox className="h-8 w-8 text-graphite/30" />
          <p className="text-graphite/60">No contact messages yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-graphite/10 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-graphite/5 font-mono text-xs uppercase tracking-wider text-graphite/50">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Received</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-graphite/8 transition hover:bg-graphite/[0.03]"
                >
                  <td className="px-5 py-4 font-medium text-graphite">{item.fullName}</td>
                  <td className="px-5 py-4 text-graphite/60">{item.email}</td>
                  <td className="px-5 py-4 text-graphite/70">{item.subject}</td>
                  <td className="px-5 py-4 text-graphite/50">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as ContactMessageStatus)
                      }
                      className={
                        "rounded-full border px-3 py-1 text-xs font-medium outline-none transition disabled:opacity-60 " +
                        (STATUS_STYLES[item.status] ?? "bg-graphite/10 text-graphite/60 border-graphite/20")
                      }
                    >
                      {CONTACT_MESSAGE_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
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
