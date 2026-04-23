import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileSpreadsheet, ShieldCheck, Upload, WandSparkles } from "lucide-react";

import { FeedbackBanner } from "../components/ui/feedback-banner";
import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import {
  useApproveSubmissionBatch,
  useAdminData,
  useCurrentUser,
  useImportPrices,
  usePendingSubmissionBatches,
  useRejectSubmissionBatch,
} from "../hooks/use-phase9-data";
import { formatCalendarDate, formatWeekEnding } from "../lib/formatters";

export function AdminPage() {
  const { data, isLoading } = useAdminData();
  const { data: currentUser } = useCurrentUser();
  const { data: pendingSubmissions } = usePendingSubmissionBatches();
  const importPrices = useImportPrices();
  const approveSubmission = useApproveSubmissionBatch();
  const rejectSubmission = useRejectSubmissionBatch();
  const [csvFileName, setCsvFileName] = useState("weekly-price-update.csv");
  const [csvContent, setCsvContent] = useState(
    "market_code,commodity_slug,price_date,price,unit,source_note\nMKD,yam,2026-04-18,6040,bag,Weekly market survey",
  );
  const [marketFilter, setMarketFilter] = useState("ALL");
  const [commodityFilter, setCommodityFilter] = useState("ALL");

  const importSummary = useMemo(() => importPrices.data?.importBatch ?? null, [importPrices.data?.importBatch]);

  const filteredPending = useMemo(() => {
    if (!pendingSubmissions?.items) return [];
    return pendingSubmissions.items.filter((batch) => {
      const matchesMarket = marketFilter === "ALL" || batch.affectedMarkets.some((market) => market.code === marketFilter);
      const matchesCommodity = commodityFilter === "ALL" || batch.affectedCommodities.some((commodity) => commodity.slug === commodityFilter);
      return matchesMarket && matchesCommodity;
    });
  }, [commodityFilter, marketFilter, pendingSubmissions?.items]);

  const filteredRecentRecords = useMemo(() => {
    if (!data?.recentRecords) return [];
    return data.recentRecords.filter((record) => {
      const matchesMarket = marketFilter === "ALL" || record.marketCode === marketFilter;
      const matchesCommodity = commodityFilter === "ALL" || record.commoditySlug === commodityFilter;
      return matchesMarket && matchesCommodity;
    });
  }, [commodityFilter, data?.recentRecords, marketFilter]);

  if (currentUser?.role !== "ADMIN") {
    return (
      <QueryState
        title="Admin Access Required"
        description="This page is for administrators who review submissions, manage imports, and approve records before they affect the platform."
        guidance="You can return to the public dashboard or sign in with an administrator account."
      />
    );
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setCsvContent(await file.text());
  }

  async function handleImportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await importPrices.mutateAsync({ fileName: csvFileName, csvContent });
  }

  if (isLoading) {
    return (
      <QueryState
        title="Loading Admin Workspace"
        description="Loading review items, import settings, and the latest official records."
        guidance="This workspace controls what becomes part of the official market dataset."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Admin Workspace Temporarily Unavailable"
        description="Admin information is not available right now."
        guidance="You can try again shortly. Existing approved records will remain unchanged."
        tone="warning"
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Admin Workspace"
        title="Controlled data management for weekly market updates"
        description="Use this workspace to manage weekly records, review public submissions, and keep the official dataset accurate."
        action={<StatusPill tone={data.source === "live" ? "jade" : "mint"}>{data.source === "live" ? "Live Data" : "Saved Data"}</StatusPill>}
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3">
            <form onSubmit={handleImportSubmit} className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade"><Upload className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">Weekly CSV Import</h3>
                  <p className="text-sm text-bapi-evergreen/68">Admin imports add validated records directly to the official dataset.</p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-5">
                <p className="font-medium text-bapi-evergreen">{csvFileName}</p>
                <p className="mt-1 text-sm text-bapi-evergreen/58">Accepted format: {data.importTemplate.acceptedFileTypes}</p>
                <input type="file" accept=".csv" onChange={handleFileChange} className="mt-4 block w-full text-sm text-bapi-evergreen/72 file:mr-4 file:rounded-full file:border-0 file:bg-bapi-evergreen file:px-4 file:py-2 file:font-semibold file:text-white" />
              </div>
              <textarea value={csvContent} onChange={(event) => setCsvContent(event.target.value)} rows={8} className="mt-4 min-h-[200px] rounded-[1.4rem] border border-white/60 bg-white/75 px-4 py-3 font-mono text-xs leading-6 text-bapi-evergreen outline-none" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-bapi-evergreen/62">Use one row per commodity, market, and week ending date.</p>
                <button type="submit" disabled={importPrices.isPending} className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:bg-bapi-evergreen/40">{importPrices.isPending ? "Importing..." : "Import weekly prices"}</button>
              </div>
              {importSummary ? <div className="mt-4"><FeedbackBanner tone="success" title="Import completed" description={`${importSummary.successRows} row(s) imported and ${importSummary.failedRows} row(s) failed review in this import.`} detail={`File: ${importSummary.fileName}`} /></div> : null}
              {importPrices.error ? <div className="mt-4"><FeedbackBanner tone="error" title="Import unavailable" description={importPrices.error.message} detail="Review the file format, then try again." /></div> : null}
            </form>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">Access Control</h3>
                  <p className="text-sm text-bapi-evergreen/68">{currentUser ? `${currentUser.fullName} is signed in as ${currentUser.role}.` : "Sign in with an administrator account to use review tools."}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">{data.note}</p>
            </article>
          </div>

          <div className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Review Queue</p>
                <h3 className="mt-2 font-display text-2xl text-bapi-evergreen">Review public submissions before publication.</h3>
              </div>
              <StatusPill tone="amber">{filteredPending.length} Awaiting Review</StatusPill>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <select value={marketFilter} onChange={(event) => setMarketFilter(event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 text-sm outline-none">
                <option value="ALL">All markets</option>
                {data.marketOptions.map((market) => <option key={market.code} value={market.code}>{market.name}</option>)}
              </select>
              <select value={commodityFilter} onChange={(event) => setCommodityFilter(event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 text-sm outline-none">
                <option value="ALL">All commodities</option>
                {data.commodityOptions.map((commodity) => <option key={commodity.slug} value={commodity.slug}>{commodity.name}</option>)}
              </select>
            </div>

            <div className="mt-5 grid gap-3">
              {filteredPending.length ? filteredPending.map((batch) => (
                <article key={batch.id} className="rounded-[1.3rem] border border-white/55 bg-bapi-cream/72 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-bapi-evergreen">{batch.fileName}</p>
                      <p className="mt-1 text-sm text-bapi-evergreen/58">{batch.submitterName || "Unnamed contributor"}{batch.submitterEmail ? ` | ${batch.submitterEmail}` : ""}</p>
                      <p className="mt-1 text-sm text-bapi-evergreen/58">Received {formatCalendarDate(batch.createdAt.slice(0, 10))} | Reference {batch.publicReferenceCode}</p>
                    </div>
                    <StatusPill tone="amber">Under review</StatusPill>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-bapi-evergreen/72">
                    <div><p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">Total rows</p><p className="mt-1 font-semibold">{batch.totalRows}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">Valid rows</p><p className="mt-1 font-semibold">{batch.validRows}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">Invalid rows</p><p className="mt-1 font-semibold">{batch.invalidRows}</p></div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">Markets: {batch.affectedMarkets.map((market) => market.name).join(", ") || "None"} | Commodities: {batch.affectedCommodities.map((commodity) => commodity.name).join(", ") || "None"}</p>
                  <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">Impact summary: {batch.impactSummary.created} new official record(s) and {batch.impactSummary.updated} existing record(s) will be updated if this batch is approved.</p>
                  <div className="mt-4 grid gap-2">
                    {batch.previewRows.map((row) => (
                      <div key={row.id} className="rounded-[1rem] border border-white/60 bg-white/72 px-3 py-3 text-sm text-bapi-evergreen/70">
                        <p>{row.commodity?.name ?? row.commoditySlug} in {row.market?.name ?? row.marketCode} | {formatWeekEnding(row.priceDate)} | {row.price.toLocaleString()} / {row.unit}</p>
                        {row.currentOfficialValue ? <p className="mt-1 text-xs text-bapi-evergreen/55">Current official value: {row.currentOfficialValue.price.toLocaleString()} / {row.currentOfficialValue.unit}</p> : <p className="mt-1 text-xs text-bapi-evergreen/55">No current official value for this same market, commodity, week, and unit.</p>}
                        {row.sourceNote ? <p className="mt-1 text-xs text-bapi-evergreen/55">Source note: {row.sourceNote}</p> : null}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => approveSubmission.mutate(batch.id)} disabled={approveSubmission.isPending || rejectSubmission.isPending} className="rounded-full bg-bapi-evergreen px-4 py-2 text-sm font-semibold text-white disabled:bg-bapi-evergreen/40">{approveSubmission.isPending ? "Approving..." : "Approve batch"}</button>
                    <button type="button" onClick={() => rejectSubmission.mutate({ id: batch.id, reviewNote: "Submission rejected during review. The records were not added to the official market dataset." })} disabled={approveSubmission.isPending || rejectSubmission.isPending} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-bapi-evergreen shadow-soft disabled:opacity-55">{rejectSubmission.isPending ? "Rejecting..." : "Reject batch"}</button>
                  </div>
                </article>
              )) : <p className="text-sm leading-6 text-bapi-evergreen/62">There are no public uploads waiting for review right now.</p>}
            </div>

            {approveSubmission.data ? <div className="mt-4"><FeedbackBanner tone="success" title="Approval completed" description={approveSubmission.data.message} detail={`${approveSubmission.data.appliedRows.created} new record(s), ${approveSubmission.data.appliedRows.updated} updated record(s).`} /></div> : null}
            {rejectSubmission.data ? <div className="mt-4"><FeedbackBanner tone="info" title="Review completed" description={rejectSubmission.data.message} /></div> : null}

            <div className="mt-5 rounded-[1.4rem] border border-white/55 bg-white/68 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Recent official records</p>
                  <p className="mt-2 text-sm text-bapi-evergreen/68">Use the same filters to scan the latest official prices already visible to the public.</p>
                </div>
                <StatusPill tone="mint">{filteredRecentRecords.length} Records</StatusPill>
              </div>
              <div className="mt-4 grid gap-3">
                {filteredRecentRecords.length ? filteredRecentRecords.map((record) => (
                  <article key={record.id} className="rounded-[1.2rem] border border-white/55 bg-bapi-cream/72 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-bapi-evergreen">{record.commodity} in {record.market}</p>
                        <p className="text-sm text-bapi-evergreen/58">{formatWeekEnding(record.priceDate)}</p>
                      </div>
                      <p className="text-sm font-semibold text-bapi-evergreen">{record.price.toLocaleString()} / {record.unit}</p>
                    </div>
                  </article>
                )) : <p className="text-sm leading-6 text-bapi-evergreen/62">No recent official records match the current filters.</p>}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[1.4rem] bg-[linear-gradient(140deg,rgba(15,58,47,0.92),rgba(15,58,47,0.78))] p-4 text-white">
              <WandSparkles className="h-5 w-5 text-bapi-mint" />
              <p className="text-sm leading-6 text-white/82">Official statistics are based on approved submissions and validated admin records.</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
