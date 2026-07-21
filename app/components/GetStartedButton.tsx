import Link from "next/link";

export function GetStartedButton({
  className = "",
  onClick,
  label = "Get Started Free",
}: {
  className?: string;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <Link
      href="/builder"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-none bg-amber-400 px-6 py-3 text-sm font-semibold text-[var(--off-white)] transition-colors hover:bg-amber-300 ${className}`}
    >
      {label}
    </Link>
  );
}
