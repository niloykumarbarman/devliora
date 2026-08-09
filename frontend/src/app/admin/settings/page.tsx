"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Loader2, Save, ImageIcon, Upload } from "lucide-react";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/siteSettings";
import { uploadImage } from "@/lib/adminUploads";
import { resolveImageUrl } from "@/lib/hero";

const inputClass =
  "mt-1 w-full rounded-lg border border-graphite/15 px-3 py-2.5 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/10";
const labelClass = "block font-mono text-xs uppercase tracking-wider text-graphite/50";

export default function AdminSettingsPage() {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [portfolioHeroImageUrl, setPortfolioHeroImageUrl] = useState("");
  const [industriesImageUrl, setIndustriesImageUrl] = useState("");
  const [servicesImageUrl, setServicesImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingIndustries, setUploadingIndustries] = useState(false);
  const [uploadingServices, setUploadingServices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSiteSettings();
        if (data) {
          setSettingsId(data.id);
          setLogoUrl(data.logoUrl);
          setSiteName(data.siteName);
          setPortfolioHeroImageUrl(data.portfolioHeroImageUrl);
          setIndustriesImageUrl(data.industriesImageUrl);
          setServicesImageUrl(data.servicesImageUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load site settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleHeroFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingHero(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setPortfolioHeroImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload portfolio hero image.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleIndustriesFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingIndustries(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setIndustriesImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload industries image.");
    } finally {
      setUploadingIndustries(false);
    }
  };

  const handleServicesFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingServices(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setServicesImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload services image.");
    } finally {
      setUploadingServices(false);
    }
  };

  const handleSave = async () => {
    if (!settingsId) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateSiteSettings({
        id: settingsId,
        logoUrl,
        siteName,
        portfolioHeroImageUrl,
        industriesImageUrl,
        servicesImageUrl,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-2 text-graphite/60">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading site settings...
      </div>
    );
  }

  return (
    <div>
      <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
        /admin/settings
      </span>
      <h1 className="mt-2 text-3xl font-semibold text-graphite">Site Settings</h1>

      {error && (
        <div className="mt-6 rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 rounded-lg border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal">
          Site settings saved.
        </div>
      )}

      <div className="admin-fade-in mt-8 grid grid-cols-1 gap-6 rounded-xl border border-graphite/10 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Site Name</label>
          <input
            required
            value={siteName}
            onChange={(e) => {
              setSiteName(e.target.value);
              setSuccess(false);
            }}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Logo</label>
          <div className="mt-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(logoUrl)}
                alt="Logo preview"
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No logo set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload new logo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Portfolio Page Hero Background</label>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {portfolioHeroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(portfolioHeroImageUrl)}
                alt="Portfolio hero preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No portfolio hero image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingHero ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingHero ? "Uploading..." : "Upload portfolio hero image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleHeroFileChange}
              disabled={uploadingHero}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Industries Menu Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            Shown next to the industry list in the navbar&apos;s Industries dropdown.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {industriesImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(industriesImageUrl)}
                alt="Industries menu preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No industries menu image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingIndustries ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingIndustries ? "Uploading..." : "Upload industries menu image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleIndustriesFileChange}
              disabled={uploadingIndustries}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Services Menu Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            Shown next to the Services/Technologies/Solutions columns in the navbar&apos;s
            Services dropdown.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {servicesImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(servicesImageUrl)}
                alt="Services menu preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No services menu image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingServices ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingServices ? "Uploading..." : "Upload services menu image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleServicesFileChange}
              disabled={uploadingServices}
            />
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading || !settingsId}
            className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
