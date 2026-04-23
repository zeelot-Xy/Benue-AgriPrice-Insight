import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileSearch, Plus, ShieldCheck, Trash2, Upload } from "lucide-react";

import { FeedbackBanner } from "../components/ui/feedback-banner";
import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import {
  usePublicPriceManualEntry,
  usePublicPriceUpload,
  useSubmissionStatusLookup,
  useUploadPageData,
} from "../hooks/use-phase9-data";
import { formatDateTime } from "../lib/formatters";

type SubmissionMode = "csv" | "manual";

type ManualRow = {
  id: string;
  marketCode: string;
  commoditySlug: string;
  priceDate: string;
  price: string;
  unit: string;
  sourceNote: string;
};

const emptyRow = (index: number): ManualRow => ({
  id: `row-${index}-${Date.now()}`,
  marketCode: "",
  commoditySlug: "",
  priceDate: "",
  price: "",
  unit: "bag",
  sourceNote: "",
});

const statusTone = (status: string) =>
  status === "APPROVED" ? "jade" : status === "REJECTED" ? "amber" : "mint";

export function UploadPricesPage() {
  const { data, isLoading } = useUploadPageData();
  const upload = usePublicPriceUpload();
  const manualEntry = usePublicPriceManualEntry();
  const [mode, setMode] = useState<SubmissionMode>("csv");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [csvFileName, setCsvFileName] = useState("community-weekly-prices.csv");
  const [csvContent, setCsvContent] = useState(
    "market_code,commodity_slug,price_date,price,unit,source_note\nMKD,yam,2026-04-18,6040,bag,Community market observation",
  );
  const [rows, setRows] = useState<ManualRow[]>([emptyRow(1)]);
  const [manualError, setManualError] = useState<string | null>(null);
  const [lookupCodeInput, setLookupCodeInput] = useState("");
  const [lookupCode, setLookupCode] = useState("");

  const activeMutation = mode === "csv" ? upload : manualEntry;
  const latestResponse = mode === "csv" ? upload.data : manualEntry.data;
  const latestBatch = useMemo(() => latestResponse?.batch ?? null, [latestResponse?.batch]);
  const statusLookup = useSubmissionStatusLookup(lookupCode);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setCsvContent(await file.text());
  }

  async function submitCsv(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await upload.mutateAsync({
      fileName: csvFileName,
      csvContent,
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
    });
    setLookupCodeInput(result.batch.publicReferenceCode);
    setLookupCode(result.batch.publicReferenceCode);
  }

  async function submitManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const invalid = rows.find(
      (row) =>
        !row.marketCode.trim() ||
        !row.commoditySlug.trim() ||
        !row.priceDate.trim() ||
        !row.unit.trim() ||
        !row.price.trim() ||
        Number(row.price) <= 0,
    );

    if (invalid) {
      setManualError(
        "Complete every row with a market, commodity, week ending date, positive price, and unit before submitting.",
      );
      return;
    }

    setManualError(null);
    const result = await manualEntry.mutateAsync({
      fileName: "manual-price-entry.json",
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
      rows: rows.map((row) => ({
        marketCode: row.marketCode,
        commoditySlug: row.commoditySlug,
        priceDate: row.priceDate,
        price: Number(row.price),
        unit: row.unit,
        sourceNote: row.sourceNote || undefined,
      })),
    });
    setLookupCodeInput(result.batch.publicReferenceCode);
    setLookupCode(result.batch.publicReferenceCode);
  }

  function updateRow(id: string, field: keyof Omit<ManualRow, "id">, value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  if (isLoading) {
    return (
      <QueryState
        title="Preparing Submission Workspace"
        description="Loading the public submission form and approved scope for markets and commodities."
        guidance="You will be able to submit a CSV file, enter prices directly, and check a submission reference code here."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Submission Workspace Temporarily Unavailable"
        description="The public submission form could not be loaded right now."
        guidance="You can still browse the public pages and try again in a moment."
        tone="warning"
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Community Contribution"
        title="Submit weekly price updates for admin review"
        description="You can upload a CSV file or fill the form directly here. Every submission is checked before it affects official statistics."
        action={<StatusPill tone={data.source === "live" ? "jade" : "mint"}>{data.source === "live" ? "Review Queue Open" : "Reference Mode"}</StatusPill>}
      >
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5">
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setMode("csv")} className={["rounded-full px-4 py-2 text-sm font-semibold", mode === "csv" ? "bg-bapi-evergreen text-white" : "bg-bapi-cream text-bapi-evergreen/72"].join(" ")}>CSV upload</button>
              <button type="button" onClick={() => setMode("manual")} className={["rounded-full px-4 py-2 text-sm font-semibold", mode === "manual" ? "bg-bapi-evergreen text-white" : "bg-bapi-cream text-bapi-evergreen/72"].join(" ")}>Fill form directly</button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input value={submitterName} onChange={(event) => setSubmitterName(event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" placeholder="Optional contact name" />
              <input value={submitterEmail} onChange={(event) => setSubmitterEmail(event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" placeholder="Optional contact email" />
            </div>

            {mode === "csv" ? (
              <form onSubmit={submitCsv} className="mt-5 grid gap-4">
                <div className="rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-5">
                  <p className="font-medium text-bapi-evergreen">{csvFileName}</p>
                  <p className="mt-1 text-sm text-bapi-evergreen/58">Accepted format: {data.importTemplate.acceptedFileTypes}</p>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="mt-4 block w-full text-sm text-bapi-evergreen/72 file:mr-4 file:rounded-full file:border-0 file:bg-bapi-evergreen file:px-4 file:py-2 file:font-semibold file:text-white" />
                </div>
                <textarea value={csvContent} onChange={(event) => setCsvContent(event.target.value)} rows={8} className="min-h-[200px] rounded-[1.4rem] border border-white/60 bg-white/75 px-4 py-3 font-mono text-xs leading-6 text-bapi-evergreen outline-none" />
                <button type="submit" disabled={activeMutation.isPending} className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:bg-bapi-evergreen/40">
                  {activeMutation.isPending ? "Submitting for review..." : "Submit CSV for review"}
                </button>
              </form>
            ) : (
              <form onSubmit={submitManual} className="mt-5 grid gap-4">
                {rows.map((row, index) => (
                  <article key={row.id} className="rounded-[1.4rem] border border-white/55 bg-bapi-cream/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-bapi-evergreen">Entry row {index + 1}</p>
                      <button type="button" onClick={() => setRows((current) => (current.length === 1 ? current : current.filter((item) => item.id !== row.id)))} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-bapi-evergreen shadow-soft"><Trash2 className="h-3.5 w-3.5" />Remove</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <select value={row.marketCode} onChange={(event) => updateRow(row.id, "marketCode", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"><option value="">Select market</option>{data.scopeSummary.markets.map((market) => <option key={market.code} value={market.code}>{market.name} ({market.code})</option>)}</select>
                      <select value={row.commoditySlug} onChange={(event) => updateRow(row.id, "commoditySlug", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"><option value="">Select commodity</option>{data.scopeSummary.commodities.map((commodity) => <option key={commodity.slug} value={commodity.slug}>{commodity.name}</option>)}</select>
                      <input type="date" value={row.priceDate} onChange={(event) => updateRow(row.id, "priceDate", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" />
                      <input type="number" min="0" step="0.01" value={row.price} onChange={(event) => updateRow(row.id, "price", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" placeholder="Observed price" />
                      <input value={row.unit} onChange={(event) => updateRow(row.id, "unit", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" placeholder="Unit" />
                      <input value={row.sourceNote} onChange={(event) => updateRow(row.id, "sourceNote", event.target.value)} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none" placeholder="Optional source note" />
                    </div>
                  </article>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={() => setRows((current) => [...current, emptyRow(current.length + 1)])} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-bapi-evergreen shadow-soft"><Plus className="h-4 w-4" />Add another row</button>
                  <button type="submit" disabled={activeMutation.isPending} className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:bg-bapi-evergreen/40">{activeMutation.isPending ? "Submitting for review..." : "Submit form for review"}</button>
                </div>
                {manualError ? <FeedbackBanner tone="warning" title="Submission check" description={manualError} /> : null}
              </form>
            )}

            <div className="mt-5 rounded-[1.4rem] bg-bapi-mint/18 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Required columns</p>
              <div className="mt-3 flex flex-wrap gap-2">{data.importTemplate.requiredColumns.map((column) => <StatusPill key={column} tone="mint">{column}</StatusPill>)}</div>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">{data.importTemplate.note}</p>
            </div>

            {latestBatch ? (
              <div className="mt-5">
                <FeedbackBanner
                  tone="success"
                  title="Submission received"
                  description={`Reference code ${latestBatch.publicReferenceCode}. ${latestBatch.validRows} row(s) entered review and ${latestBatch.invalidRows} row(s) were excluded.`}
                  detail="Your submission is now under admin review."
                />
              </div>
            ) : null}

            {activeMutation.error ? (
              <div className="mt-4">
                <FeedbackBanner tone="error" title="Submission unavailable" description={activeMutation.error.message} detail="You can correct the file or form values and try again." />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">How review works</h3>
                  <p className="text-sm text-bapi-evergreen/68">Official statistics only use approved records.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-bapi-evergreen/72">
                <div className="rounded-[1.2rem] bg-bapi-cream/72 px-4 py-3">Submitted rows enter a review queue instead of changing the live dataset immediately.</div>
                <div className="rounded-[1.2rem] bg-bapi-cream/72 px-4 py-3">Administrators check the market, commodity, date, price, and unit before approval.</div>
                <div className="rounded-[1.2rem] bg-bapi-cream/72 px-4 py-3">Only approved rows appear in official prices, comparisons, and analysis.</div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade"><FileSearch className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">Check submission progress</h3>
                  <p className="text-sm text-bapi-evergreen/68">Use a reference code to see whether a submission is under review, approved, or rejected.</p>
                </div>
              </div>
              <form onSubmit={(event) => { event.preventDefault(); setLookupCode(lookupCodeInput.trim().toUpperCase()); }} className="mt-4 grid gap-3">
                <input value={lookupCodeInput} onChange={(event) => setLookupCodeInput(event.target.value.toUpperCase())} className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 uppercase outline-none" placeholder="BAPI-20260423-0001" />
                <button type="submit" className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft">Check submission status</button>
              </form>
              {statusLookup.isFetching ? <div className="mt-4"><FeedbackBanner tone="info" title="Checking status" description="Looking up the latest review status for this submission reference." /></div> : null}
              {statusLookup.data ? (
                <div className="mt-4 rounded-[1.4rem] border border-white/55 bg-bapi-cream/72 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-bapi-jade">{statusLookup.data.referenceCode}</p>
                      <p className="mt-2 font-semibold text-bapi-evergreen">{statusLookup.data.fileName}</p>
                    </div>
                    <StatusPill tone={statusTone(statusLookup.data.status)}>{statusLookup.data.statusLabel}</StatusPill>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-bapi-evergreen/72">{statusLookup.data.statusDescription}</p>
                  <p className="mt-3 text-sm text-bapi-evergreen/68">Submitted: {formatDateTime(statusLookup.data.submittedAt)}</p>
                  <p className="mt-1 text-sm text-bapi-evergreen/68">Accepted rows: {statusLookup.data.acceptedRows} | Excluded rows: {statusLookup.data.excludedRows}</p>
                  {statusLookup.data.reviewNote ? <p className="mt-4 rounded-[1.1rem] bg-white/80 px-4 py-3 text-sm leading-6 text-bapi-evergreen/72">{statusLookup.data.reviewNote}</p> : null}
                </div>
              ) : null}
              {statusLookup.error ? <div className="mt-4"><FeedbackBanner tone="warning" title="Reference code not found" description={statusLookup.error.message} detail="Check the code exactly as it was issued after submission, then try again." /></div> : null}
            </article>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Data trust</p>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/72">Official statistics are based on approved submissions and validated admin records.</p>
            </article>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
