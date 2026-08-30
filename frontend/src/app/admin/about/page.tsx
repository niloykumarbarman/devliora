"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import {
  fetchAbout,
  updateAbout,
  ABOUT_ICON_NAMES,
  type AboutContent,
  type AboutCard,
} from "@/lib/aboutContent";
import { uploadImage } from "@/lib/adminUploads";
import { resolveImageUrl } from "@/lib/hero";

const input =
  "mt-1 w-full rounded-lg border border-graphite/15 px-3 py-2.5 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/10";
const label = "block font-mono text-xs uppercase tracking-wider text-graphite/50";
const section =
  "admin-fade-in mt-6 grid grid-cols-1 gap-5 rounded-xl border border-graphite/10 bg-white p-6 shadow-sm";

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={label}>{props.label}</label>
      {props.hint && <p className="mt-1 text-xs text-graphite/45">{props.hint}</p>}
      {props.textarea ? (
        <textarea
          value={props.value}
          rows={props.rows ?? 4}
          onChange={(e) => props.onChange(e.target.value)}
          className={input}
        />
      ) : (
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className={input}
        />
      )}
    </div>
  );
}

function CardListEditor(props: {
  title: string;
  bodyLabel: string;
  cards: AboutCard[];
  onChange: (cards: AboutCard[]) => void;
}) {
  const { cards, onChange } = props;
  const set = (i: number, patch: Partial<AboutCard>) =>
    onChange(cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= cards.length) return;
    const next = [...cards];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((c, idx) => ({ ...c, displayOrder: idx })));
  };
  const add = () =>
    onChange([
      ...cards,
      { iconName: "sparkles", title: "", body: "", displayOrder: cards.length },
    ]);
  const remove = (i: number) =>
    onChange(cards.filter((_, idx) => idx !== i).map((c, idx) => ({ ...c, displayOrder: idx })));

  return (
    <div className={section}>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">
          {props.title}
        </h2>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg border border-graphite/15 px-3 py-1.5 text-xs font-medium text-graphite transition hover:border-signal hover:text-signal"
        >
          <Plus className="h-3.5 w-3.5" /> Add card
        </button>
      </div>

      {cards.length === 0 && (
        <p className="text-sm text-graphite/50">No cards. Click &quot;Add card&quot;.</p>
      )}

      {cards.map((card, i) => (
        <div key={i} className="rounded-lg border border-graphite/12 bg-graphite/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-graphite/40">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded p-1 text-graphite/40 hover:text-signal">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded p-1 text-graphite/40 hover:text-signal">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded p-1 text-graphite/40 hover:text-ember">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 grid gap-3 sm:grid-cols-[160px_1fr]">
            <div>
              <label className={label}>Icon</label>
              <select
                value={card.iconName}
                onChange={(e) => set(i, { iconName: e.target.value })}
                className={input}
              >
                {ABOUT_ICON_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Title</label>
              <input
                value={card.title}
                onChange={(e) => set(i, { title: e.target.value })}
                className={input}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className={label}>{props.bodyLabel}</label>
            <textarea
              value={card.body}
              rows={3}
              onChange={(e) => set(i, { body: e.target.value })}
              className={input}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAbout()
      .then((d) => {
        if (d) setData(d);
        else setError("Failed to load About content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const patch = (p: Partial<AboutContent>) => {
    setData((d) => (d ? { ...d, ...p } : d));
    setSuccess(false);
  };

  const uploadHeroImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadingHero(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      patch({ heroImageUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingHero(false);
    }
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateAbout(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-2 text-graphite/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading About content...
      </div>
    );
  }
  if (!data) {
    return <p className="mt-10 text-sm text-ember">{error || "No content."}</p>;
  }

  return (
    <div>
      <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
        /admin/about
      </span>
      <h1 className="mt-2 text-3xl font-semibold text-graphite">About Page</h1>
      <p className="mt-1 text-sm text-graphite/50">
        Every heading has a plain part and an optional accent part (shown in the
        blue signal colour). Bodies with multiple paragraphs: separate them with
        a blank line.
      </p>

      {(error || success) && (
        <div className="sticky top-4 z-20 mt-6">
          {error && (
            <div className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember shadow-md backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal shadow-md backdrop-blur-sm">
              About page saved.
            </div>
          )}
        </div>
      )}

      {/* Hero */}
      <div className={section}>
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">Hero</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Heading" value={data.heroHeading} onChange={(v) => patch({ heroHeading: v })} />
          <Field label="Heading accent" value={data.heroHeadingAccent} onChange={(v) => patch({ heroHeadingAccent: v })} />
          <Field label="Heading suffix" value={data.heroHeadingSuffix} onChange={(v) => patch({ heroHeadingSuffix: v })} />
        </div>
        <Field label="Subtitle" textarea value={data.heroSubtitle} onChange={(v) => patch({ heroSubtitle: v })} />

        <div>
          <label className={label}>Background image</label>
          <p className="mt-1 text-xs text-graphite/45">
            Optional photo behind the heading. Leave empty for the plain dark
            grid. Wide/landscape, dark-toned images work best.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {data.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(data.heroImageUrl)}
                alt="About hero preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
              {uploadingHero ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploadingHero ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                disabled={uploadingHero}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  uploadHeroImage(f);
                }}
              />
            </label>
            {data.heroImageUrl && (
              <button
                type="button"
                onClick={() => patch({ heroImageUrl: "" })}
                className="flex items-center gap-1.5 rounded-lg border border-graphite/15 px-3 py-2 text-xs font-medium text-graphite/60 transition hover:border-ember hover:text-ember"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className={section}>
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">Mission</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading" value={data.missionHeading} onChange={(v) => patch({ missionHeading: v })} />
          <Field label="Heading accent" value={data.missionHeadingAccent} onChange={(v) => patch({ missionHeadingAccent: v })} />
        </div>
        <Field label="Body (multi-paragraph)" textarea rows={7} value={data.missionBody} onChange={(v) => patch({ missionBody: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Left card — label" value={data.missionCardLabel} onChange={(v) => patch({ missionCardLabel: v })} />
          <Field label="Right card — label" value={data.visionCardLabel} onChange={(v) => patch({ visionCardLabel: v })} />
          <Field label="Left card — body" textarea value={data.missionCardBody} onChange={(v) => patch({ missionCardBody: v })} />
          <Field label="Right card — body" textarea value={data.visionCardBody} onChange={(v) => patch({ visionCardBody: v })} />
        </div>
      </div>

      {/* Founder */}
      <div className={section}>
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">Founder</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Eyebrow" value={data.founderEyebrow} onChange={(v) => patch({ founderEyebrow: v })} />
          <Field label="Name" value={data.founderName} onChange={(v) => patch({ founderName: v })} />
          <Field label="Role" value={data.founderRole} onChange={(v) => patch({ founderRole: v })} />
        </div>
        <Field label="Bio (multi-paragraph)" textarea rows={6} value={data.founderBody} onChange={(v) => patch({ founderBody: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CTA link text" value={data.founderCtaText} onChange={(v) => patch({ founderCtaText: v })} />
          <Field label="CTA link URL" value={data.founderCtaUrl} onChange={(v) => patch({ founderCtaUrl: v })} />
        </div>
      </div>

      <CardListEditor
        title="Founder — accountability cards"
        bodyLabel="Body"
        cards={data.founderCards}
        onChange={(founderCards) => patch({ founderCards })}
      />

      {/* Principles */}
      <div className={section}>
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">Principles</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading" value={data.principlesHeading} onChange={(v) => patch({ principlesHeading: v })} />
          <Field label="Heading accent" value={data.principlesHeadingAccent} onChange={(v) => patch({ principlesHeadingAccent: v })} />
        </div>
      </div>

      <CardListEditor
        title="Principles — cards"
        bodyLabel="Detail"
        cards={data.principles}
        onChange={(principles) => patch({ principles })}
      />

      {/* CTA */}
      <div className={section}>
        <h2 className="font-mono text-sm uppercase tracking-wider text-graphite/60">Closing CTA</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading" value={data.ctaHeading} onChange={(v) => patch({ ctaHeading: v })} />
          <Field label="Heading accent" value={data.ctaHeadingAccent} onChange={(v) => patch({ ctaHeadingAccent: v })} />
        </div>
        <Field label="Body" textarea value={data.ctaBody} onChange={(v) => patch({ ctaBody: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button text" value={data.ctaButtonText} onChange={(v) => patch({ ctaButtonText: v })} />
          <Field label="Button URL" value={data.ctaButtonUrl} onChange={(v) => patch({ ctaButtonUrl: v })} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
