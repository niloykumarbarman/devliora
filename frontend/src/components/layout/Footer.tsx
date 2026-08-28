import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { fetchOfficeLocations } from "@/lib/officeLocations";
import { resolveImageUrl } from "@/lib/hero";

const iconProps = { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24" } as const;

function FacebookIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M6.5 8.5H3.5V20h3V8.5zM5 3.5a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM20.5 20.5v-6.3c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1-3.3 1.8v-1.5H10v11h3v-6.1c0-.6.05-1.2.7-1.7a1.8 1.8 0 011.6-.9c1.1 0 1.7.8 1.7 2.4v6.3h3.5z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </svg>
  );
}

const FOOTER_LINKS = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/solutions", label: "Solutions" },
    { href: "/industries", label: "Industries" },
    { href: "/technologies", label: "Technologies" },
    { href: "/locations", label: "Where We Work" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
    { href: "/book-consultation", label: "Book Consultation" },
  ],
  Services: [
    { href: "/custom-software-development", label: "Custom software development" },
    { href: "/web-development", label: "Web development" },
    { href: "/services/ai-development", label: "AI development" },
    { href: "/cloud-devops", label: "Cloud & DevOps engineering" },
    { href: "/services/software-quality-assurance", label: "QA & software testing" },
    { href: "/legacy-modernization", label: "Legacy modernization" },
    { href: "/enterprise-application-development", label: "Enterprise applications" },
    { href: "/services/staff-augmentation", label: "Dedicated development teams" },
    { href: "/services/it-consulting", label: "IT consulting" },
  ],
  Legal: [
    { href: "/security", label: "Security" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
  ],
};

export default async function Footer() {
  const settings = await fetchSiteSettings();
  const offices = await fetchOfficeLocations();

  return (
    <footer className="border-t border-wire/60 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            {settings?.logoUrl ? (
              <span className="relative block h-10 w-[194px] overflow-hidden">
                <Image
                  src={resolveImageUrl(settings.logoUrl)}
                  alt="Devliora"
                  width={304}
                  height={429}
                  loading="lazy"
                  className="absolute -left-[51px] -top-[184px] h-[429px] w-[304px] max-w-none"
                />
              </span>
            ) : (
              <p className="font-display text-lg font-semibold">
                Devliora<span className="text-signal">.</span>
              </p>
            )}
            <p className="mt-3 max-w-xs text-sm text-paper/60">
              We architect and build the software systems enterprise teams
              depend on to run.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61593049053860"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-paper/50 transition-colors hover:text-signal"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/141053921/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-paper/50 transition-colors hover:text-signal"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://x.com/Devliora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-paper/50 transition-colors hover:text-signal"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://www.instagram.com/devliora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-paper/50 transition-colors hover:text-signal"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-paper/55">
              Offices
            </p>
            <ul className="mt-4 space-y-6">
              {offices.map((office) => (
                <li
                  key={office.id}
                  className="border-l-2 border-signal/40 pl-4 transition-colors hover:border-signal"
                >
                  <p className="font-display text-sm font-semibold text-paper/90">
                    {office.country}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-paper/60">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal/70" />
                    <span>{office.address}</span>
                  </p>
                  <a
                    href={`tel:${office.phone.replace(/\s+/g, "")}`}
                    className="mt-2 flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-signal"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-signal/70" />
                    <span>{office.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-paper/55">
                {heading}
              </p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 select-none overflow-hidden">
          <p
            className="font-display font-black leading-[0.85] tracking-tight bg-clip-text text-transparent"
            style={{
              fontSize: "clamp(4rem, 15vw, 13rem)",
              backgroundImage:
                "linear-gradient(100deg, var(--color-paper) 45%, var(--color-signal) 100%)",
              filter: "drop-shadow(0 0 36px rgba(61, 90, 254, 0.22))",
            }}
          >
            Devliora
            <span style={{ color: "var(--color-ember)", WebkitTextFillColor: "var(--color-ember)" }}>.</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-8 font-mono text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Devliora Systems. All rights reserved.</p>
          <p>Built with Next.js &amp; ASP.NET Core</p>
        </div>
      </div>
    </footer>
  );
}
