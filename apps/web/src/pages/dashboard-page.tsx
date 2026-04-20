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
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useDashboardData } from "../hooks/use-phase9-data";

export function DashboardPage() {
  const { data } = useDashboardData();

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Approved Markets"
          value={data.summary.totalMarkets}
          detail="The dashboard remains intentionally fixed to four representative Benue markets."
          icon={<Landmark className="h-5 w-5" />}
        />
        <MetricCard
          label="Tracked Commodities"
          value={data.summary.totalCommodities}
          detail="Only the eight academically approved commodities are visualized and analysed."
          icon={<Sprout className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Alerts"
          value={data.summary.activeAlerts}
          detail="Alert counts reflect explainable threshold logic rather than opaque scoring."
          icon={<BadgeAlert className="h-5 w-5" />}
        />
        <MetricCard
          label="Latest Week Ending"
          value={data.summary.latestWeekEnding}
          detail="The UI is organized around weekly monitoring rather than real-time feeds."
          icon={<Activity className="h-5 w-5" />}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <SectionCard
          eyebrow="Weekly Movement"
          title="Commodity trajectory across recent weekly entries"
          description="This view is designed for fast comparison of key commodity price movement and will connect directly to the price-record API in Phase 10."
          action={<StatusPill tone="mint">Mock Query Layer</StatusPill>}
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
          title="Focused actions for the demo narrative"
          description="These cards frame the user journey we will connect next: import, monitor, compare, then forecast."
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
              {data.phase9Notes.uiStatus} {data.phase9Notes.integrationStatus}
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.45fr]">
        <SectionCard
          eyebrow="Alert Stream"
          title="Rule-based movement explanations"
          description="Alerts remain explainable and plain-language first, with severity labels that can be defended in academic review."
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
          description="This panel previews the comparison-first decision support story for policymakers and traders."
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
