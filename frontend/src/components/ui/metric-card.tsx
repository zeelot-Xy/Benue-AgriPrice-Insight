import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
};

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="glass-panel rounded-[1.8rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-bapi-evergreen/48">
            {label}
          </p>
          <p className="mt-4 font-display text-4xl leading-none text-bapi-evergreen">
            {value}
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade">
          {icon}
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-bapi-evergreen/68">{detail}</p>
    </article>
  );
}
