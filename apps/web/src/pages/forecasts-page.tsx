import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useForecastData } from "../hooks/use-phase9-data";

export function ForecastsPage() {
  const { data } = useForecastData();

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Forecast Overview"
        title="Short-term projection with a clear separation from actual prices"
        description="This screen is intentionally explicit that forecasting is advisory. It sits on top of historical monitoring, not in place of it."
        action={<StatusPill tone="evergreen">Prophet Ready</StatusPill>}
      >
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="h-[340px] rounded-[1.7rem] border border-white/55 bg-white/55 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.forecastSeries}>
                <defs>
                  <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a1e8c8" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#a1e8c8" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(15,58,47,0.55)" />
                <YAxis stroke="rgba(15,58,47,0.55)" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#forecastBand)" />
                <Area type="monotone" dataKey="lower" stroke="transparent" fill="#f8f7f2" />
                <Line type="monotone" dataKey="actual" stroke="#0f3a2f" strokeWidth={3} dot={{ r: 4 }} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#34c9a2"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3">
            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Forecast Integrity</p>
              <h3 className="mt-3 font-display text-2xl text-bapi-evergreen">
                Actual and projected values are visually separated.
              </h3>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
                The dashed jade line indicates projected movement, while the deep evergreen line shows actual observed prices only.
              </p>
            </article>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Confidence Note</p>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
                With limited weekly history, forecast confidence should be treated as moderate and used to support discussion, not automatic decisions.
              </p>
            </article>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
