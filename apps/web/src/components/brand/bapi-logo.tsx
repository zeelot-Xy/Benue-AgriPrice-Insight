import { Sprout } from "lucide-react";

type BapiLogoProps = {
  compact?: boolean;
};

export function BapiLogo({ compact = false }: BapiLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-white/40 bg-[linear-gradient(150deg,#0f3a2f,#34c9a2_60%,#a1e8c8)] shadow-[0_14px_28px_rgba(15,58,47,0.28)]">
        <div className="pointer-events-none absolute inset-[9px] rounded-xl border border-white/20" />
        <Sprout className="relative z-10 h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-2xl font-semibold leading-none tracking-[0.08em] text-bapi-evergreen">
          B<span className="text-bapi-jade">A</span>PI
        </div>
        {!compact ? (
          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-bapi-evergreen/55">
            Benue AgriPrice Insight
          </p>
        ) : null}
      </div>
    </div>
  );
}
