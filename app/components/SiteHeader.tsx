"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GetStartedButton } from "./GetStartedButton";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="m6 6 12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

function NavLink({
  children,
  href = "#",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium text-[var(--off-white)] transition-opacity hover:opacity-80 ${className}`}
    >
      {children}
    </Link>
  );
}

const NAV_LINKS = [
  { label: "How It Works", href: "#" },
  { label: "TAGS", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Log In", href: "#" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Transparent mode (homepage only): fixed so it floats directly over the
  // hero image with no bar of its own — reads as part of the artwork until
  // the user scrolls, at which point .theme-header's data-theme="warm"
  // rule (see globals.css) fades in a background + border. Every other page
  // keeps the original always-sticky, always-solid header untouched.
  const headerClassName = transparent
    ? "theme-header fixed inset-x-0 top-0 z-50"
    : "sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur";

  return (
    <header className={headerClassName}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={55}
            height={55}
            priority
            className="h-8 w-8"
          />
          <span className="relative block h-8 w-60 overflow-hidden">
            <Image
              src="/image.png"
              alt="VIN Voice"
              width={1536}
              height={1024}
              priority
              className="absolute max-w-none"
              style={{ width: "273px", height: "182px", left: "-25px", top: "-107px" }}
            />
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <span className="hidden sm:inline-flex">
            <GetStartedButton />
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-white sm:hidden"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-zinc-950/95 px-6 py-5 backdrop-blur sm:hidden">
          <div className="flex flex-col items-start gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <GetStartedButton
              className="mt-2 w-full"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
