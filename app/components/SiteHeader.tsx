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
      className={`text-sm font-medium text-zinc-400 transition-colors hover:text-white ${className}`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="relative block h-8 w-60 overflow-hidden">
          <Image
            src="/image.png"
            alt="VIN Voice"
            width={1536}
            height={1024}
            priority
            className="absolute max-w-none"
            style={{ width: "273px", height: "182px", left: "-25px", top: "-107px" }}
          />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline-flex">
            <GetStartedButton />
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:text-white"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex flex-col items-start gap-4">
            <NavLink href="#" onClick={() => setMobileMenuOpen(false)}>
              How it works
            </NavLink>
            <NavLink href="/pricing" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </NavLink>
            <NavLink href="#" onClick={() => setMobileMenuOpen(false)}>
              Log in
            </NavLink>
            <GetStartedButton
              className="mt-2 w-full sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
