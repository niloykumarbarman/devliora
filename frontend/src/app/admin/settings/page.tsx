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
  const [servicesBannerImageUrl, setServicesBannerImageUrl] = useState("");
  const [servicesEngineeringImageUrl, setServicesEngineeringImageUrl] = useState("");
  const [servicesTechImageUrl, setServicesTechImageUrl] = useState("");
  const [servicesSolutionsImageUrl, setServicesSolutionsImageUrl] = useState("");
  const [technologiesHeroImageUrl, setTechnologiesHeroImageUrl] = useState("");
  const [technologiesBackendImageUrl, setTechnologiesBackendImageUrl] = useState("");
  const [technologiesFrontendImageUrl, setTechnologiesFrontendImageUrl] = useState("");
  const [technologiesCloudImageUrl, setTechnologiesCloudImageUrl] = useState("");
  const [technologiesDatabaseImageUrl, setTechnologiesDatabaseImageUrl] = useState("");
  const [technologiesDevOpsImageUrl, setTechnologiesDevOpsImageUrl] = useState("");
  const [technologiesAiMlImageUrl, setTechnologiesAiMlImageUrl] = useState("");
  const [technologiesMobileImageUrl, setTechnologiesMobileImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingIndustries, setUploadingIndustries] = useState(false);
  const [uploadingServices, setUploadingServices] = useState(false);
  const [uploadingServicesBanner, setUploadingServicesBanner] = useState(false);
  const [uploadingServicesEngineering, setUploadingServicesEngineering] = useState(false);
  const [uploadingServicesTech, setUploadingServicesTech] = useState(false);
  const [uploadingServicesSolutions, setUploadingServicesSolutions] = useState(false);
  const [uploadingTechnologiesHero, setUploadingTechnologiesHero] = useState(false);
  const [uploadingTechnologiesBackend, setUploadingTechnologiesBackend] = useState(false);
  const [uploadingTechnologiesFrontend, setUploadingTechnologiesFrontend] = useState(false);
  const [uploadingTechnologiesCloud, setUploadingTechnologiesCloud] = useState(false);
  const [uploadingTechnologiesDatabase, setUploadingTechnologiesDatabase] = useState(false);
  const [uploadingTechnologiesDevOps, setUploadingTechnologiesDevOps] = useState(false);
  const [uploadingTechnologiesAiMl, setUploadingTechnologiesAiMl] = useState(false);
  const [uploadingTechnologiesMobile, setUploadingTechnologiesMobile] = useState(false);
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
          setServicesBannerImageUrl(data.servicesBannerImageUrl);
          setServicesEngineeringImageUrl(data.servicesEngineeringImageUrl);
          setServicesTechImageUrl(data.servicesTechImageUrl);
          setServicesSolutionsImageUrl(data.servicesSolutionsImageUrl);
          setTechnologiesHeroImageUrl(data.technologiesHeroImageUrl);
          setTechnologiesBackendImageUrl(data.technologiesBackendImageUrl);
          setTechnologiesFrontendImageUrl(data.technologiesFrontendImageUrl);
          setTechnologiesCloudImageUrl(data.technologiesCloudImageUrl);
          setTechnologiesDatabaseImageUrl(data.technologiesDatabaseImageUrl);
          setTechnologiesDevOpsImageUrl(data.technologiesDevOpsImageUrl);
          setTechnologiesAiMlImageUrl(data.technologiesAiMlImageUrl);
          setTechnologiesMobileImageUrl(data.technologiesMobileImageUrl);
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

  const handleServicesBannerFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingServicesBanner(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setServicesBannerImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload services page banner image.");
    } finally {
      setUploadingServicesBanner(false);
    }
  };

  const handleServicesEngineeringFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingServicesEngineering(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setServicesEngineeringImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Engineering Services image.");
    } finally {
      setUploadingServicesEngineering(false);
    }
  };

  const handleServicesTechFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingServicesTech(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setServicesTechImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Advanced Technologies image.");
    } finally {
      setUploadingServicesTech(false);
    }
  };

  const handleServicesSolutionsFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingServicesSolutions(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setServicesSolutionsImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Tailored Solutions image.");
    } finally {
      setUploadingServicesSolutions(false);
    }
  };

  const handleTechnologiesHeroFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesHero(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesHeroImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Technologies page hero image.");
    } finally {
      setUploadingTechnologiesHero(false);
    }
  };

  const handleTechnologiesBackendFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesBackend(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesBackendImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Backend & APIs image.");
    } finally {
      setUploadingTechnologiesBackend(false);
    }
  };

  const handleTechnologiesFrontendFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesFrontend(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesFrontendImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Frontend & UI image.");
    } finally {
      setUploadingTechnologiesFrontend(false);
    }
  };

  const handleTechnologiesCloudFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesCloud(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesCloudImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Cloud & Infrastructure image.");
    } finally {
      setUploadingTechnologiesCloud(false);
    }
  };

  const handleTechnologiesDatabaseFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesDatabase(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesDatabaseImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Databases & Caching image.");
    } finally {
      setUploadingTechnologiesDatabase(false);
    }
  };

  const handleTechnologiesDevOpsFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesDevOps(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesDevOpsImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload DevOps & CI/CD image.");
    } finally {
      setUploadingTechnologiesDevOps(false);
    }
  };

  const handleTechnologiesAiMlFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesAiMl(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesAiMlImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload AI/ML & Data image.");
    } finally {
      setUploadingTechnologiesAiMl(false);
    }
  };

  const handleTechnologiesMobileFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingTechnologiesMobile(true);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadImage(file);
      setTechnologiesMobileImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Mobile Apps image.");
    } finally {
      setUploadingTechnologiesMobile(false);
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
        servicesBannerImageUrl,
        servicesEngineeringImageUrl,
        servicesTechImageUrl,
        servicesSolutionsImageUrl,
        technologiesHeroImageUrl,
        technologiesBackendImageUrl,
        technologiesFrontendImageUrl,
        technologiesCloudImageUrl,
        technologiesDatabaseImageUrl,
        technologiesDevOpsImageUrl,
        technologiesAiMlImageUrl,
        technologiesMobileImageUrl,
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

      {/* Sticky, not just inline: this form is now long (8 image upload
          fields), so an error/success message anchored only at the top
          scrolls out of view while working on fields further down — a
          failed upload there looked like it silently did nothing. */}
      {(error || success) && (
        <div className="sticky top-4 z-20 mt-6">
          {error && (
            <div className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember shadow-md backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal shadow-md backdrop-blur-sm">
              Site settings saved.
            </div>
          )}
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
            Services dropdown only. The /services page itself has its own 4 images below.
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

        <div className="md:col-span-2">
          <label className={labelClass}>Services Page — Title Banner Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The full-bleed &quot;Services&quot; title banner at the top of /services.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {servicesBannerImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(servicesBannerImageUrl)}
                alt="Services page banner preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No banner image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingServicesBanner ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingServicesBanner ? "Uploading..." : "Upload banner image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleServicesBannerFileChange}
              disabled={uploadingServicesBanner}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Services Page — &quot;Engineering Services&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image next to the &quot;Engineering Services&quot; heading and service list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {servicesEngineeringImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(servicesEngineeringImageUrl)}
                alt="Engineering Services preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingServicesEngineering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingServicesEngineering ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleServicesEngineeringFileChange}
              disabled={uploadingServicesEngineering}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Services Page — &quot;Advanced Technologies&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image above the &quot;Customer Voice&quot; testimonial in the Advanced Technologies section.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {servicesTechImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(servicesTechImageUrl)}
                alt="Advanced Technologies preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingServicesTech ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingServicesTech ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleServicesTechFileChange}
              disabled={uploadingServicesTech}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Services Page — &quot;Tailored Solutions&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image next to the &quot;Tailored Solutions&quot; heading and solutions list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {servicesSolutionsImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(servicesSolutionsImageUrl)}
                alt="Tailored Solutions preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingServicesSolutions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingServicesSolutions ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleServicesSolutionsFileChange}
              disabled={uploadingServicesSolutions}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — Title Banner Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The full-bleed &quot;Technologies&quot; title banner at the top of /technologies.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesHeroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesHeroImageUrl)}
                alt="Technologies page banner preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No banner image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesHero ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesHero ? "Uploading..." : "Upload banner image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesHeroFileChange}
              disabled={uploadingTechnologiesHero}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;Backend & APIs&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;Backend & APIs&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesBackendImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesBackendImageUrl)}
                alt="Backend & APIs preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesBackend ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesBackend ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesBackendFileChange}
              disabled={uploadingTechnologiesBackend}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;Frontend & UI&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;Frontend & UI&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesFrontendImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesFrontendImageUrl)}
                alt="Frontend & UI preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesFrontend ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesFrontend ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesFrontendFileChange}
              disabled={uploadingTechnologiesFrontend}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;Cloud & Infrastructure&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;Cloud & Infrastructure&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesCloudImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesCloudImageUrl)}
                alt="Cloud & Infrastructure preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesCloud ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesCloud ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesCloudFileChange}
              disabled={uploadingTechnologiesCloud}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;Databases & Caching&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;Databases & Caching&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesDatabaseImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesDatabaseImageUrl)}
                alt="Databases & Caching preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesDatabase ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesDatabase ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesDatabaseFileChange}
              disabled={uploadingTechnologiesDatabase}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;DevOps & CI/CD&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;DevOps & CI/CD&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesDevOpsImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesDevOpsImageUrl)}
                alt="DevOps & CI/CD preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesDevOps ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesDevOps ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesDevOpsFileChange}
              disabled={uploadingTechnologiesDevOps}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;AI/ML & Data&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;AI/ML & Data&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesAiMlImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesAiMlImageUrl)}
                alt="AI/ML & Data preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesAiMl ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesAiMl ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesAiMlFileChange}
              disabled={uploadingTechnologiesAiMl}
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Technologies Page — &quot;Mobile Apps&quot; Image</label>
          <p className="mt-1 text-xs text-graphite/50">
            The image beside the &quot;Mobile Apps&quot; category section&apos;s tech list.
          </p>
          <div className="mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-graphite/15 bg-graphite/5">
            {technologiesMobileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(technologiesMobileImageUrl)}
                alt="Mobile Apps preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-graphite/30">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-graphite/15 px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-signal hover:text-signal">
            {uploadingTechnologiesMobile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadingTechnologiesMobile ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleTechnologiesMobileFileChange}
              disabled={uploadingTechnologiesMobile}
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
