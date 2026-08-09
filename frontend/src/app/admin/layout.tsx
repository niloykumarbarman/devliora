"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Newspaper,
  BookOpenText,
  Briefcase,
  Mail,
  MessageSquare,
  Wrench,
  FolderKanban,
  Quote,
  PanelTop,
  Cpu,
  Building2,
  HelpCircle,
  LogOut,
  Settings,
  MapPin,
  Handshake,
} from "lucide-react";
import { clearAdminToken, isAdminAuthenticated } from "@/lib/adminAuth";

const NAV_ITEMS = [
  { href: "/admin/consultations", label: "Consultations", icon: CalendarClock },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpenText },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/hero", label: "Hero", icon: PanelTop },
  { href: "/admin/technologies", label: "Technologies", icon: Cpu },
  { href: "/admin/industries", label: "Industries", icon: Building2 },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/office-locations", label: "Office Locations", icon: MapPin },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  const isLoginPage = pathname === "/admin/login";
  const activeIndex = NAV_ITEMS.findIndex((item) => pathname?.startsWith(item.href));

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [isLoginPage, router]);

  useEffect(() => {
    if (!navRef.current || activeIndex === -1) {
      setIndicator(null);
      return;
    }
    const el = navRef.current.children[activeIndex] as HTMLElement | undefined;
    if (el) {
      setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    }
  }, [activeIndex, checked]);

  const handleLogout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-paper">
        <span className="font-mono text-sm uppercase tracking-widest text-wire/60">
          Checking session...
        </span>
      </div>
    );
  }

  return (
    <div className="admin-page-bg min-h-screen text-graphite md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col admin-glass-sidebar text-paper md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <LayoutDashboard className="h-5 w-5 text-signal" />
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
            Devliora Admin
          </span>
        </div>

        <nav ref={navRef} className="relative mt-2 flex flex-1 flex-col gap-1 px-4">
          {indicator && (
            <span
              className="absolute left-0 w-1 rounded-r-full bg-signal transition-all duration-300 ease-out"
              style={{ top: indicator.top, height: indicator.height }}
              aria-hidden="true"
            />
          )}
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-lg admin-glass-nav-active px-4 py-3 text-sm font-medium text-paper transition"
                    : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-wire/60 transition hover:bg-paper/5 hover:text-wire"
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-wire/15 px-4 py-3 text-sm text-wire/70 transition hover:border-ember/40 hover:text-ember"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar + horizontal nav */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-graphite/10 bg-ink text-paper md:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-signal" />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
                /admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md border border-wire/20 px-3 py-2 text-sm text-wire/80 transition hover:border-ember/40 hover:text-ember"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <nav className="flex items-center gap-4 overflow-x-auto border-t border-paper/10 px-6 py-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  pathname?.startsWith(item.href)
                    ? "whitespace-nowrap text-xs font-medium text-signal"
                    : "whitespace-nowrap text-xs font-medium text-wire/70"
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <main key={pathname} className="admin-fade-in mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
