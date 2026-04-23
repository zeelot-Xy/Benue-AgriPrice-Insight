import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeAlert,
  Landmark,
  Sprout,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "../components/ui/metric-card";
import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useDashboardData } from "../hooks/use-phase9-data";
import { formatWeekEnding } from "../lib/formatters";

export function DashboardPage() {
  const { data, isLoading } = useDashboardData();
  const [selectedMarket, setSelectedMarket] = useState("ALL");
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([
    "yam",
    "rice",
    "beans",
  ]);

  useEffect(() => {
    if (!data?.commodityOptions?.length) {
      return;
    }

    setSelectedCommodities((current) => {
      const validSelection = current.filter((slug) =>
        data.commodityOptions.some((item) => item.slug === slug),
      );

      if (validSelection.length === 3) {
        return validSelection;
      }

      const nextSelection = [...validSelection];

      for (const commodity of data.commodityOptions) {
        if (nextSelection.length === 3) {
          break;
        }

        if (!nextSelection.includes(commodity.slug)) {
          nextSelection.push(commodity.slug);
        }
      }

      return nextSelection.slice(0, 3);
    });
  }, [data]);

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

  if (isLoading) {
    return (
      <QueryState
        title="Loading Dashboard"
        description="Loading the latest market summary, alerts, and weekly price records."
        guidance="You can still return to the other public pages while live dashboard data loads."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Dashboard Unavailable"
        description="Market data is temporarily unavailable."
        guidance="You can still browse the public pages or try again in a moment."
        tone="warning"
      />
    );
  }

  const selectedCommodityDetails = selectedCommodities
    .map((slug) => data.commodityOptions.find((item) => item.slug === slug))
    .filter((item): item is { slug: string; name: string } => Boolean(item));

  function toggleCommodity(slug: string) {
    setSelectedCommodities((current) => {
      if (current.includes(slug)) {
        return current.length === 1 ? current : current.filter((item) => item !== slug);
      }

      if (current.length < 3) {
        return [...current, slug];
      }

      return [...current.slice(1), slug];
    });
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Approved Markets"
          value={data.summary.totalMarkets}
          detail="This dashboard tracks four key markets across Benue State."
          icon={<Landmark className="h-5 w-5" />}
        />
        <MetricCard
          label="Tracked Commodities"
          value={data.summary.totalCommodities}
          detail="Prices are monitored for eight major commodities."
          icon={<Sprout className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Alerts"
          value={data.summary.activeAlerts}
          detail="Alerts show where price movement needs attention."
          icon={<BadgeAlert className="h-5 w-5" />}
        />
        <MetricCard
          label="Latest Week Ending"
          value={data.summary.latestWeekEnding === "N/A" ? "N/A" : formatWeekEnding(data.summary.latestWeekEnding)}
          detail="Prices are updated as weekly records, not live feeds."
          icon={<Activity className="h-5 w-5" />}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <SectionCard
          eyebrow="Weekly Movement"
          title="Commodity trajectory across recent weekly entries"
          description="Use this chart to compare recent price movement. You can switch between the eight tracked commodities and keep up to three on screen at once."
          action={
            <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
              {data.source === "live" ? "Live Data" : "Saved Data"}
            </StatusPill>
          }
        >
          <div className="mb-5 flex flex-wrap gap-2">
            {data.commodityOptions.map((commodity) => {
              const isSelected = selectedCommodities.includes(commodity.slug);

              return (
                <button
                  key={commodity.slug}
                  type="button"
                  onClick={() => toggleCommodity(commodity.slug)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "bg-bapi-evergreen text-white"
                      : "bg-white/60 text-bapi-evergreen/75 hover:bg-white/80",
                  ].join(" ")}
                >
                  {commodity.name}
                </button>
              );
            })}
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyPriceSeries}>
                <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(15,58,47,0.55)" />
                <YAxis stroke="rgba(15,58,47,0.55)" />
                <Tooltip />
                {selectedCommodityDetails.map((commodity, index) => (
                  <Line
                    key={commodity.slug}
                    type="monotone"
                    dataKey={commodity.slug}
                    name={commodity.name}
                    stroke={commodityColors[commodity.slug as keyof typeof commodityColors] ?? "#0f3a2f"}
                    strokeWidth={index === 0 ? 3 : 2.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-bapi-evergreen/65">
            {selectedCommodityDetails.map((commodity) => (
              <span
                key={commodity.slug}
                className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      commodityColors[commodity.slug as keyof typeof commodityColors] ?? "#0f3a2f",
                  }}
                />
                {commodity.name}
              </span>
            ))}
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-bapi-mint/16 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">
            This chart shows how weekly average prices move over time. It helps you see whether selected commodities are rising, falling, or holding steady.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Quick Actions"
          title="Core tasks across the monitoring workflow"
          description="These are the main things people do in BAPI: update prices, review alerts, compare markets, and study weekly movement."
        >
          <div className="grid gap-3">
            {data.quickActions.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-white/55 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-bapi-evergreen">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">{item.caption}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-bapi-jade" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-bapi-jade/20 bg-[linear-gradient(135deg,rgba(52,201,162,0.12),rgba(161,232,200,0.1))] p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-bapi-jade">Build Status</p>
            <p className="mt-3 text-sm leading-6 text-bapi-evergreen/70">
              {data.note} {data.phase9Notes.uiStatus} {data.phase9Notes.integrationStatus}
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.45fr]">
        <SectionCard
          eyebrow="Alert Stream"
          title="Rule-based movement explanations"
          description="Each alert explains what changed, where it happened, and how serious it looks."
        >
          <div className="grid gap-3">
            {data.alerts.map((alert) => (
              <article key={`${alert.commodity}-${alert.market}`} className="rounded-[1.5rem] border border-white/55 bg-white/65 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-bapi-evergreen">
                      {alert.commodity} in {alert.market}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">{alert.explanation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={alert.severity === "High" ? "amber" : "jade"}>{alert.severity}</StatusPill>
                    <span className="rounded-full bg-bapi-evergreen/8 px-3 py-1 text-sm font-semibold text-bapi-evergreen">
                      {alert.delta}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-white/60 px-4 py-3 text-sm leading-6 text-bapi-evergreen/68">
            Alerts turn raw price changes into plain-language warnings so users can quickly see where attention is needed most.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Market Comparison"
          title="Cross-market reading for selected commodity prices"
          description="Compare commodity prices across markets to spot where prices are stronger or weaker."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMarket("ALL")}
              className={["rounded-full px-4 py-2 text-sm font-semibold", selectedMarket === "ALL" ? "bg-bapi-evergreen text-white" : "bg-white/60 text-bapi-evergreen/72"].join(" ")}
            >
              All markets
            </button>
            {data.marketOptions.map((market) => (
              <button
                key={market.code}
                type="button"
                onClick={() => setSelectedMarket(market.name)}
                className={["rounded-full px-4 py-2 text-sm font-semibold", selectedMarket === market.name ? "bg-bapi-evergreen text-white" : "bg-white/60 text-bapi-evergreen/72"].join(" ")}
              >
                {market.name}
              </button>
            ))}
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedMarket === "ALL" ? data.marketComparison : data.marketComparison.filter((item) => item.market === selectedMarket)}>
                <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
                <XAxis dataKey="market" stroke="rgba(15,58,47,0.55)" />
                <YAxis stroke="rgba(15,58,47,0.55)" />
                <Tooltip />
                <Bar dataKey="soybean" fill="#0f3a2f" radius={[8, 8, 0, 0]} />
                <Bar dataKey="millet" fill="#34c9a2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="sorghum" fill="#a1e8c8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-bapi-mint/16 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">
            This chart compares official market prices across locations. Use the market filter to reduce scanning when you want to focus on one market first.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
