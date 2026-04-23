import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useMarketData } from "../hooks/use-phase9-data";
import { useState } from "react";

export function MarketsPage() {
  const { data, isLoading } = useMarketData();
  const [selectedCommodity, setSelectedCommodity] = useState("soybean");

  if (isLoading) {
    return (
      <QueryState
        title="Loading Markets"
        description="Loading market profiles, comparisons, and seasonal notes."
        guidance="You can still browse the dashboard while market summaries load."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Markets Unavailable"
        description="Market information is temporarily unavailable."
        guidance="You can still browse the public pages or try again in a moment."
        tone="warning"
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
        <SectionCard
          eyebrow="Selected Markets"
          title="The four representative Benue markets in the project scope"
          description="Each card gives a quick picture of one of the four markets covered by this platform."
        action={
          <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
            {data.source === "live" ? "Live Data" : "Saved Data"}
          </StatusPill>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {data.marketCards.map((market) => (
            <article key={market.code} className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">{market.code}</p>
                  <h3 className="mt-2 font-display text-2xl text-bapi-evergreen">{market.name}</h3>
                </div>
                <StatusPill tone="mint">{market.lga} LGA</StatusPill>
              </div>
              <p className="mt-4 text-sm font-semibold text-bapi-evergreen/78">{market.focus}</p>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">{market.summary}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard
          eyebrow="Comparative Snapshot"
          title="Current cross-market commodity view"
          description="This chart lets you compare selected commodity prices across the four markets at a glance."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {data.comparisonCommodityOptions.map((commodity) => (
              <button
                key={commodity.slug}
                type="button"
                onClick={() => setSelectedCommodity(commodity.slug)}
                className={["rounded-full px-4 py-2 text-sm font-semibold", selectedCommodity === commodity.slug ? "bg-bapi-evergreen text-white" : "bg-white/60 text-bapi-evergreen/72"].join(" ")}
              >
                {commodity.name}
              </button>
            ))}
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.comparison}>
                <CartesianGrid stroke="rgba(15,58,47,0.08)" vertical={false} />
                <XAxis dataKey="market" stroke="rgba(15,58,47,0.55)" />
                <YAxis stroke="rgba(15,58,47,0.55)" />
                <Tooltip />
                <Bar dataKey={selectedCommodity} fill="#0f3a2f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-bapi-mint/16 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">
            This chart shows how one selected commodity compares across markets so users do not have to scan multiple overlapping bars at once.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Seasonality Notes"
          title="Monthly explainers that stay readable"
          description={`${data.note} These notes explain the monthly pattern in simple terms.`}
        >
          <div className="grid gap-3">
            {data.seasonalityInsights.map((item) => (
              <article key={`${item.commodity}-${item.month}`} className="rounded-[1.5rem] border border-white/55 bg-white/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-bapi-evergreen">{item.commodity}</h3>
                  <StatusPill tone="jade">{item.month}</StatusPill>
                </div>
                <p className="mt-3 text-sm text-bapi-evergreen/78">
                  Typical price: <span className="font-semibold">{item.averagePrice}</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">{item.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-[1.2rem] bg-white/60 px-4 py-3 text-sm leading-6 text-bapi-evergreen/68">
            Official statistics are based on approved submissions and validated admin records.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
