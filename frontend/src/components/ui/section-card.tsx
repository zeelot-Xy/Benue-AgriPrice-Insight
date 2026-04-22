import type { PropsWithChildren, ReactNode } from "react";

type SectionCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}>;

export function SectionCard({
  eyebrow,
  title,
  description,
  action,
  className = "",
  children,
}: SectionCardProps) {
  return (
    <section className={`glass-panel rounded-[2rem] p-5 md:p-6 ${className}`.trim()}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-bapi-jade">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl text-bapi-evergreen">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-bapi-evergreen/68">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
