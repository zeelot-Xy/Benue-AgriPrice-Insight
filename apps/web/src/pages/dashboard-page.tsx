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

export function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <QueryState
        title="Loading Dashboard"
        description="Loading the latest market summary, alerts, and weekly price records."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Dashboard Unavailable"
        description="Dashboard information is not available right now."
      />
    );
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
          value={data.summary.latestWeekEnding}
          detail="Prices are updated as weekly records, not live feeds."
          icon={<Activity className="h-5 w-5" />}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <SectionCard
          eyebrow="Weekly Movement"
          title="Commodity trajectory across recent weekly entries"
          description="Use this chart to compare how key commodity prices have moved in recent weeks."
          action={
            <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
              {data.source === "live" ? "Live Data" : "Saved Data"}
            </StatusPill>
          }
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyPriceSeries}>
                <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(15,58,47,0.55)" />
                <YAxis stroke="rgba(15,58,47,0.55)" />
                <Tooltip />
                <Line type="monotone" dataKey="yam" stroke="#0f3a2f" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="rice" stroke="#34c9a2" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="beans" stroke="#82b59d" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Quick Actions"
          title="Core tasks across the monitoring workflow"
          description="These are the main things people do in BAPI: update prices, review alerts, compare markets, and check forecasts."
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
        </SectionCard>

        <SectionCard
          eyebrow="Market Comparison"
          title="Cross-market reading for soybean, millet, and sorghum"
          description="Compare selected commodities across the four markets to spot where prices are stronger or weaker."
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.marketComparison}>
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
        </SectionCard>
      </div>
    </div>
  );
}
