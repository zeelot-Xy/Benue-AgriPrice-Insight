import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useAnalyticsData } from "../hooks/use-phase9-data";

export function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsData();
  const [activeCommodityIndex, setActiveCommodityIndex] = useState(0);
  const [selectedContextCommodity, setSelectedContextCommodity] = useState("ALL");
  const commodityColors = useMemo(
    () => ({
      yam: "#0f3a2f",
      cassava: "#5f7f6e",
      rice: "#34c9a2",
      maize: "#8fcf8c",
      beans: "#82b59d",
      soybean: "#1f7a66",
      millet: "#b3a06b",
      sorghum: "#7d8f63",
    }),
    [],
  );

  useEffect(() => {
    setActiveCommodityIndex(0);
  }, [data?.commodityOptions]);

  useEffect(() => {
    if (!data?.commodityOptions?.length || data.commodityOptions.length === 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveCommodityIndex((current) => (current + 1) % data.commodityOptions.length);
    }, 15000);

    return () => window.clearInterval(interval);
  }, [data?.commodityOptions]);

  if (isLoading) {
    return (
      <QueryState
        title="Loading Analytics"
        description="Loading alerts, seasonal patterns, and recent price movement."
        guidance="You can still browse the dashboard and markets pages while analytics load."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Analytics Unavailable"
        description="Analytics are temporarily unavailable."
        guidance="You can still browse the public pages or try again in a moment."
        tone="warning"
      />
    );
  }

  const activeCommodity =
    data.commodityOptions[activeCommodityIndex] ?? data.commodityOptions[0];
  const activeCommodityColor =
    commodityColors[activeCommodity?.slug as keyof typeof commodityColors] ?? "#34c9a2";
  const fillId = `${activeCommodity?.slug ?? "commodity"}-fill`;

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
        <div className="mb-5 flex flex-wrap gap-2">
          {data.commodityOptions.map((commodity, index) => {
            const isActive = index === activeCommodityIndex;

            return (
              <span
                key={commodity.slug}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-bapi-evergreen text-white"
                    : "bg-white/60 text-bapi-evergreen/60",
                ].join(" ")}
              >
                {commodity.name}
              </span>
            );
          })}
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weeklyPriceSeries}>
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeCommodityColor} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={activeCommodityColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
              <XAxis dataKey="week" stroke="rgba(15,58,47,0.55)" />
              <YAxis stroke="rgba(15,58,47,0.55)" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={activeCommodity?.slug}
                name={activeCommodity?.name}
                stroke={activeCommodityColor}
                fill={`url(#${fillId})`}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 rounded-[1.2rem] bg-bapi-mint/16 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">
          This chart rotates through commodities every 15 seconds so non-technical users can see weekly movement one commodity at a time without an overcrowded chart.
        </p>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <SectionCard
          eyebrow="Alert Logic"
          title="Severity and reasoning cards"
          description="Each alert shows the size of the change and explains why it matters."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedContextCommodity("ALL")}
              className={["rounded-full px-4 py-2 text-sm font-semibold", selectedContextCommodity === "ALL" ? "bg-bapi-evergreen text-white" : "bg-white/60 text-bapi-evergreen/72"].join(" ")}
            >
              All commodities
            </button>
            {data.commodityOptions.map((commodity) => (
              <button
                key={commodity.slug}
                type="button"
                onClick={() => setSelectedContextCommodity(commodity.slug)}
                className={["rounded-full px-4 py-2 text-sm font-semibold", selectedContextCommodity === commodity.slug ? "bg-bapi-evergreen text-white" : "bg-white/60 text-bapi-evergreen/72"].join(" ")}
              >
                {commodity.name}
              </button>
            ))}
          </div>
          <div className="grid gap-3">
            {data.alerts
              .filter((alert) => selectedContextCommodity === "ALL" || alert.commoditySlug === selectedContextCommodity)
              .map((alert) => (
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
          <p className="mt-4 rounded-[1.2rem] bg-white/60 px-4 py-3 text-sm leading-6 text-bapi-evergreen/68">
            Alerts explain whether prices are moving upward, downward, or staying stable enough to watch.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Monthly Reading"
          title="Seasonality interpretation cards"
          description={`${data.note} Each note explains the chart in plain language.`}
        >
          <div className="grid gap-3">
            {data.seasonalityInsights
              .filter(
                (item) =>
                  selectedContextCommodity === "ALL" ||
                  ("commoditySlug" in item && item.commoditySlug === selectedContextCommodity),
              )
              .map((item) => (
              <article key={`${item.commodity}-${item.month}`} className="rounded-[1.5rem] border border-white/55 bg-white/62 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-bapi-evergreen">{item.commodity}</h3>
                  <StatusPill tone="mint">{item.month}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">{item.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-bapi-mint/16 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">
            Seasonality cards summarize the typical monthly pattern so users can understand what usually happens before comparing it with current weeks.
          </p>
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
        <p className="mt-4 rounded-[1.2rem] bg-white/60 px-4 py-3 text-sm leading-6 text-bapi-evergreen/68">
          Official statistics are based on approved submissions and validated admin records.
        </p>
      </SectionCard>
    </div>
  );
}
