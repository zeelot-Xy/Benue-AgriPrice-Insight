import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  FileSpreadsheet,
  PencilLine,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import {
  usePublicPriceManualEntry,
  usePublicPriceUpload,
  useUploadPageData,
} from "../hooks/use-phase9-data";

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

function createManualRow(index: number): ManualRow {
  return {
    id: `row-${index}-${Date.now()}`,
    marketCode: "",
    commoditySlug: "",
    priceDate: "",
    price: "",
    unit: "bag",
    sourceNote: "",
  };
}

export function UploadPricesPage() {
  const { data, isLoading } = useUploadPageData();
  const upload = usePublicPriceUpload();
  const manualEntry = usePublicPriceManualEntry();
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>("csv");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [csvFileName, setCsvFileName] = useState("community-weekly-prices.csv");
  const [csvContent, setCsvContent] = useState(
    "market_code,commodity_slug,price_date,price,unit,source_note\nMKD,yam,2026-04-18,6040,bag,Community market observation",
  );
  const [manualRows, setManualRows] = useState<ManualRow[]>([createManualRow(1)]);
  const [manualValidationError, setManualValidationError] = useState<string | null>(null);

  const activeMutation = submissionMode === "csv" ? upload : manualEntry;
  const activeSummary = useMemo(
    () => (submissionMode === "csv" ? upload.data?.batch ?? null : manualEntry.data?.batch ?? null),
    [manualEntry.data?.batch, submissionMode, upload.data?.batch],
  );
  const activeMessage =
    submissionMode === "csv" ? upload.data?.message : manualEntry.data?.message;
  const activeFailures =
    submissionMode === "csv" ? upload.data?.failures : manualEntry.data?.failures;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvFileName(file.name);
    setCsvContent(await file.text());
  }

  async function handleCsvSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await upload.mutateAsync({
      fileName: csvFileName,
      csvContent,
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
    });
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const invalidRow = manualRows.find(
      (row) =>
        !row.marketCode.trim() ||
        !row.commoditySlug.trim() ||
        !row.priceDate.trim() ||
        !row.unit.trim() ||
        !row.price.trim() ||
        !Number.isFinite(Number(row.price)) ||
        Number(row.price) <= 0,
    );

    if (invalidRow) {
      setManualValidationError(
        "Complete every row with a market, commodity, week ending date, positive price, and unit before submitting.",
      );
      return;
    }

    setManualValidationError(null);

    await manualEntry.mutateAsync({
      fileName: "manual-price-entry.json",
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
      rows: manualRows.map((row) => ({
        marketCode: row.marketCode,
        commoditySlug: row.commoditySlug,
        priceDate: row.priceDate,
        price: Number(row.price),
        unit: row.unit,
        sourceNote: row.sourceNote || undefined,
      })),
    });
  }

  function updateManualRow(id: string, field: keyof Omit<ManualRow, "id">, value: string) {
    setManualRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function addManualRow() {
    setManualValidationError(null);
    setManualRows((rows) => [...rows, createManualRow(rows.length + 1)]);
  }

  function removeManualRow(id: string) {
    setManualValidationError(null);
    setManualRows((rows) => (rows.length === 1 ? rows : rows.filter((row) => row.id !== id)));
  }

  if (isLoading) {
    return (
      <QueryState
        title="Loading Upload Workspace"
        description="Loading the public submission form and approved upload options."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Upload Workspace Unavailable"
        description="The upload page is not available right now."
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Community Contribution"
        title="Submit weekly price updates for admin review"
        description="You can upload a CSV file or fill the form directly here. Every submission is reviewed before it affects the platform."
        action={
          <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
            {data.source === "live" ? "Review Queue Open" : "Reference Mode"}
          </StatusPill>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSubmissionMode("csv")}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  submissionMode === "csv"
                    ? "bg-bapi-evergreen text-white"
                    : "bg-bapi-cream text-bapi-evergreen/72",
                ].join(" ")}
              >
                <Upload className="h-4 w-4" />
                CSV upload
              </button>
              <button
                type="button"
                onClick={() => setSubmissionMode("manual")}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  submissionMode === "manual"
                    ? "bg-bapi-evergreen text-white"
                    : "bg-bapi-cream text-bapi-evergreen/72",
                ].join(" ")}
              >
                <PencilLine className="h-4 w-4" />
                Fill form directly
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-bapi-evergreen">Your name</span>
                <input
                  value={submitterName}
                  onChange={(event) => setSubmitterName(event.target.value)}
                  className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                  placeholder="Optional contact name"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-bapi-evergreen">Email address</span>
                <input
                  value={submitterEmail}
                  onChange={(event) => setSubmitterEmail(event.target.value)}
                  className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                  placeholder="Optional contact email"
                />
              </label>
            </div>

            {submissionMode === "csv" ? (
              <form onSubmit={handleCsvSubmit} className="mt-5">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-bapi-evergreen">Upload file</span>
                  <div className="rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-bapi-jade">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-bapi-evergreen">{csvFileName}</p>
                        <p className="text-sm text-bapi-evergreen/58">
                          Accepted format: {data.importTemplate.acceptedFileTypes}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="mt-4 block w-full text-sm text-bapi-evergreen/72 file:mr-4 file:rounded-full file:border-0 file:bg-bapi-evergreen file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  </div>
                </label>

                <label className="mt-4 grid gap-2 text-sm">
                  <span className="font-medium text-bapi-evergreen">CSV content preview</span>
                  <textarea
                    value={csvContent}
                    onChange={(event) => setCsvContent(event.target.value)}
                    rows={8}
                    className="min-h-[200px] rounded-[1.4rem] border border-white/60 bg-white/75 px-4 py-3 font-mono text-xs leading-6 text-bapi-evergreen outline-none"
                  />
                </label>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-bapi-evergreen/62">
                    Each row should contain one commodity price for one market and one week.
                  </p>
                  <button
                    type="submit"
                    disabled={activeMutation.isPending}
                    className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-bapi-evergreen/40"
                  >
                    {activeMutation.isPending ? "Submitting..." : "Submit CSV for review"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleManualSubmit} className="mt-5">
                <div className="grid gap-4">
                  {manualRows.map((row, index) => {
                    const selectedCommodity = data.scopeSummary.commodities.find(
                      (commodity) => commodity.slug === row.commoditySlug,
                    );

                    return (
                      <article
                        key={row.id}
                        className="rounded-[1.4rem] border border-white/55 bg-bapi-cream/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-bapi-evergreen">
                            Entry row {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeManualRow(row.id)}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-bapi-evergreen shadow-soft"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <label className="grid gap-2 text-sm">
                            <span className="font-medium text-bapi-evergreen">Market</span>
                            <select
                              value={row.marketCode}
                              onChange={(event) => {
                                setManualValidationError(null);
                                updateManualRow(row.id, "marketCode", event.target.value);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                            >
                              <option value="">Select market</option>
                              {data.scopeSummary.markets.map((market) => (
                                <option key={market.code} value={market.code}>
                                  {market.name} ({market.code})
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="grid gap-2 text-sm">
                            <span className="font-medium text-bapi-evergreen">Commodity</span>
                            <select
                              value={row.commoditySlug}
                              onChange={(event) => {
                                const nextSlug = event.target.value;
                                const nextCommodity = data.scopeSummary.commodities.find(
                                  (commodity) => commodity.slug === nextSlug,
                                );
                                setManualRows((rows) =>
                                  rows.map((current) =>
                                    current.id === row.id
                                      ? {
                                          ...current,
                                          commoditySlug: nextSlug,
                                          unit: nextCommodity?.defaultUnit ?? current.unit,
                                        }
                                      : current,
                                  ),
                                );
                                setManualValidationError(null);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                            >
                              <option value="">Select commodity</option>
                              {data.scopeSummary.commodities.map((commodity) => (
                                <option key={commodity.slug} value={commodity.slug}>
                                  {commodity.name}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="grid gap-2 text-sm">
                            <span className="font-medium text-bapi-evergreen">Week ending</span>
                            <input
                              type="date"
                              value={row.priceDate}
                              onChange={(event) => {
                                setManualValidationError(null);
                                updateManualRow(row.id, "priceDate", event.target.value);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                            />
                          </label>

                          <label className="grid gap-2 text-sm">
                            <span className="font-medium text-bapi-evergreen">Price</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.price}
                              onChange={(event) => {
                                setManualValidationError(null);
                                updateManualRow(row.id, "price", event.target.value);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                              placeholder="Enter observed price"
                            />
                          </label>

                          <label className="grid gap-2 text-sm">
                            <span className="font-medium text-bapi-evergreen">Unit</span>
                            <input
                              value={row.unit}
                              onChange={(event) => {
                                setManualValidationError(null);
                                updateManualRow(row.id, "unit", event.target.value);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                              placeholder="bag"
                            />
                            {selectedCommodity ? (
                              <span className="text-xs text-bapi-evergreen/55">
                                Suggested unit: {selectedCommodity.defaultUnit}
                              </span>
                            ) : null}
                          </label>

                          <label className="grid gap-2 text-sm md:col-span-2">
                            <span className="font-medium text-bapi-evergreen">Source note</span>
                            <input
                              value={row.sourceNote}
                              onChange={(event) => {
                                setManualValidationError(null);
                                updateManualRow(row.id, "sourceNote", event.target.value);
                              }}
                              className="rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 outline-none"
                              placeholder="Optional note about how the price was observed"
                            />
                          </label>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={addManualRow}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-bapi-evergreen shadow-soft"
                  >
                    <Plus className="h-4 w-4" />
                    Add another row
                  </button>
                  <button
                    type="submit"
                    disabled={activeMutation.isPending}
                    className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-bapi-evergreen/40"
                  >
                    {activeMutation.isPending ? "Submitting..." : "Submit form for review"}
                  </button>
                </div>

                {manualValidationError ? (
                  <p className="mt-4 rounded-[1.2rem] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {manualValidationError}
                  </p>
                ) : null}
              </form>
            )}

            <div className="mt-5 rounded-[1.4rem] bg-bapi-mint/18 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Required columns</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.importTemplate.requiredColumns.map((column) => (
                  <StatusPill key={column} tone="mint">
                    {column}
                  </StatusPill>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
                {data.importTemplate.note}
              </p>
            </div>

            {activeSummary ? (
              <div className="mt-5 rounded-[1.4rem] border border-bapi-jade/20 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">
                      Submission received
                    </p>
                    <p className="mt-2 font-semibold text-bapi-evergreen">
                      {activeSummary.fileName}
                    </p>
                  </div>
                  <StatusPill tone="jade">{activeSummary.status}</StatusPill>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-bapi-evergreen/72">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Total rows
                    </p>
                    <p className="mt-1 font-semibold">{activeSummary.totalRows}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Pending review
                    </p>
                    <p className="mt-1 font-semibold">{activeSummary.validRows}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Rejected rows
                    </p>
                    <p className="mt-1 font-semibold">{activeSummary.invalidRows}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">
                  {activeMessage}
                </p>
                {activeFailures?.length ? (
                  <p className="mt-3 text-sm leading-6 text-amber-700">
                    {activeFailures.length} row(s) were excluded before the batch entered review.
                  </p>
                ) : null}
              </div>
            ) : null}

            {activeMutation.error ? (
              <p className="mt-4 rounded-[1.2rem] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {activeMutation.error.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4">
            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">How review works</h3>
                  <p className="text-sm text-bapi-evergreen/68">
                    Submissions are checked before they appear in the main dataset.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "Submitted rows enter a pending review queue instead of the live dataset.",
                  "Administrators check the submission against approved markets, commodities, and date formats.",
                  "Only approved rows are added to prices, alerts, comparisons, and forecasts.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.2rem] bg-bapi-cream/72 px-4 py-3 text-sm text-bapi-evergreen/72"
                  >
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-bapi-jade/15 text-xs font-semibold text-bapi-jade">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Approved scope</p>
              <div className="mt-4 grid gap-3">
                <div>
                  <p className="text-sm font-semibold text-bapi-evergreen">Markets</p>
                  <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">
                    {data.scopeSummary.markets
                      .map((market) => `${market.name} (${market.code})`)
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bapi-evergreen">Commodities</p>
                  <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">
                    {data.scopeSummary.commodities
                      .map((commodity) => commodity.name)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
