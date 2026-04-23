type FeedbackBannerProps = {
  tone?: "success" | "warning" | "info" | "error";
  title: string;
  description: string;
  detail?: string | null;
};

const toneStyles: Record<NonNullable<FeedbackBannerProps["tone"]>, string> = {
  success: "border-bapi-jade/22 bg-bapi-mint/18 text-bapi-evergreen",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

export function FeedbackBanner({
  tone = "info",
  title,
  description,
  detail,
}: FeedbackBannerProps) {
  return (
    <div
      className={[
        "rounded-[1.3rem] border px-4 py-4",
        toneStyles[tone],
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.22em]">{title}</p>
      <p className="mt-2 text-sm font-medium leading-6">{description}</p>
      {detail ? (
        <p className="mt-2 text-sm leading-6 opacity-80">{detail}</p>
      ) : null}
    </div>
  );
}
