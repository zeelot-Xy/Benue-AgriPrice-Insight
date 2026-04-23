type QueryStateProps = {
  title: string;
  description: string;
  guidance?: string;
  tone?: "neutral" | "warning" | "info";
};

const toneStyles: Record<NonNullable<QueryStateProps["tone"]>, string> = {
  neutral: "text-bapi-jade",
  warning: "text-amber-700",
  info: "text-sky-700",
};

export function QueryState({
  title,
  description,
  guidance,
  tone = "neutral",
}: QueryStateProps) {
  return (
    <div className="glass-panel rounded-[1.8rem] p-6">
      <p className={["text-xs uppercase tracking-[0.26em]", toneStyles[tone]].join(" ")}>
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
        {description}
      </p>
      {guidance ? (
        <p className="mt-3 text-sm leading-6 text-bapi-evergreen/58">{guidance}</p>
      ) : null}
    </div>
  );
}
