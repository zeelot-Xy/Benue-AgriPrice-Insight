import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useAnalyticsData } from "../hooks/use-phase9-data";

export function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsData();

  if (isLoading) {
    return (
      <QueryState
        title="Loading Analytics"
        description="Loading alerts, seasonal patterns, and recent price movement."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Analytics Unavailable"
        description="Analytics information is not available right now."
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
        <SectionCard
          eyebrow="Trend Detection"
          title="Explainable movement using weekly observed records"
          description="This page shows how prices are moving using weekly records, clear alert rules, and simple explanations."
        action={
          <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
            {data.source === "live" ? "Live Data" : "Saved Data"}
          </StatusPill>
        }
      >
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weeklyPriceSeries}>
              <defs>
                <linearGradient id="maizeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34c9a2" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#34c9a2" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
              <XAxis dataKey="week" stroke="rgba(15,58,47,0.55)" />
              <YAxis stroke="rgba(15,58,47,0.55)" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="maize"
                stroke="#34c9a2"
                fill="url(#maizeFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <SectionCard
          eyebrow="Alert Logic"
          title="Severity and reasoning cards"
          description="Each alert shows the size of the change and explains why it matters."
        >
          <div className="grid gap-3">
            {data.alerts.map((alert) => (
              <article key={`${alert.commodity}-${alert.market}`} className="rounded-[1.5rem] border border-white/55 bg-white/62 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-bapi-jade">{alert.market}</p>
                    <h3 className="mt-2 font-semibold text-bapi-evergreen">{alert.commodity}</h3>
                  </div>
                  <StatusPill tone={alert.severity === "High" ? "amber" : "jade"}>{alert.delta}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">{alert.explanation}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Monthly Reading"
          title="Seasonality interpretation cards"
          description={`${data.note} Each note explains the chart in plain language.`}
        >
          <div className="grid gap-3">
            {data.seasonalityInsights.map((item) => (
              <article key={`${item.commodity}-${item.month}`} className="rounded-[1.5rem] border border-white/55 bg-white/62 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-bapi-evergreen">{item.commodity}</h3>
                  <StatusPill tone="mint">{item.month}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">{item.note}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="All Commodities"
        title="Full snapshot across the eight tracked commodities"
        description="This view gives a broader comparison across all commodities using the latest available average price."
      >
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.allCommoditySnapshot}>
              <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
              <XAxis dataKey="commodity" stroke="rgba(15,58,47,0.55)" angle={-18} textAnchor="end" height={70} />
              <YAxis stroke="rgba(15,58,47,0.55)" />
              <Tooltip />
              <Bar dataKey="averagePrice" fill="#0f3a2f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
