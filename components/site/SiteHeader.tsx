"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV = ["museum", "timeline", "map", "stories", "heroes", "about"] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tDemo = useTranslations("demo");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other = locale === "bn" ? "en" : "bn";

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/90 backdrop-blur-md">
      <p className="border-b border-line/50 bg-ink-2 px-4 py-1.5 text-center text-xs text-muted">
        {tDemo("banner")}
      </p>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={t("home")}>
          <span aria-hidden className="relative block size-7 rounded-full bg-green">
            <span className="absolute top-1/2 left-[45%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" />
          </span>
          <span className="font-display text-lg leading-none font-semibold tracking-tight">
            {locale === "bn" ? "মুক্তিযুদ্ধ জাদুঘর" : "Liberation War Museum"}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((key) => {
              const href = `/${key}`;
              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className="rounded-full px-3.5 py-2 text-sm text-paper-dim transition-colors hover:text-paper aria-[current=page]:bg-ink-3 aria-[current=page]:text-paper"
                  >
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={other}
            lang={other}
            aria-label={t("switchLabel")}
            className="btn min-h-9 px-3.5 text-xs"
          >
            {t("switchTo")}
          </Link>
          <button
            type="button"
            className="btn min-h-9 px-3.5 text-xs lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-ink lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV.map((key) => (
              <li key={key}>
                <Link
                  href={`/${key}`}
                  aria-current={isActive(`/${key}`) ? "page" : undefined}
                  className="block rounded-lg px-3 py-3 text-base text-paper-dim hover:bg-ink-2 hover:text-paper aria-[current=page]:text-paper"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
