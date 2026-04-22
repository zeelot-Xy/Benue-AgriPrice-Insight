import type { ReactNode } from "react";

type StatusPillProps = {
  tone: "jade" | "mint" | "amber" | "evergreen";
  children: ReactNode;
};

const toneClasses: Record<StatusPillProps["tone"], string> = {
  jade: "bg-bapi-jade/15 text-bapi-jade",
  mint: "bg-bapi-mint/35 text-bapi-evergreen",
  amber: "bg-amber-100 text-amber-700",
  evergreen: "bg-bapi-evergreen text-white",
};

export function StatusPill({ tone, children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
