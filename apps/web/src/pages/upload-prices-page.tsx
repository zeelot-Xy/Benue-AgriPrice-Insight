import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileSpreadsheet, ShieldCheck, Upload } from "lucide-react";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import {
  usePublicPriceUpload,
  useUploadPageData,
} from "../hooks/use-phase9-data";

export function UploadPricesPage() {
  const { data, isLoading } = useUploadPageData();
  const upload = usePublicPriceUpload();
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [csvFileName, setCsvFileName] = useState("community-weekly-prices.csv");
  const [csvContent, setCsvContent] = useState(
    "market_code,commodity_slug,price_date,price,unit,source_note\nMKD,yam,2026-04-18,6040,bag,Community market observation",
  );

  const submissionSummary = useMemo(() => upload.data?.batch ?? null, [upload.data]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvFileName(file.name);
    setCsvContent(await file.text());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await upload.mutateAsync({
      fileName: csvFileName,
      csvContent,
      submitterName: submitterName || undefined,
      submitterEmail: submitterEmail || undefined,
    });
  }

  if (isLoading) {
    return (
      <QueryState
        title="Loading Upload Workspace"
        description="Preparing the public contribution flow and approved BAPI upload scope."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Upload Workspace Unavailable"
        description="The contribution workflow could not be prepared for this screen."
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Community Contribution"
        title="Submit weekly price updates for admin review"
        description="Use this page to send weekly price observations into the BAPI review queue. Submitted records remain pending until an administrator verifies and approves them."
        action={
          <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
            {data.source === "live" ? "Review Queue Active" : "Offline Guidance"}
          </StatusPill>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-bapi-evergreen">Upload weekly prices</h3>
                <p className="text-sm text-bapi-evergreen/68">
                  Public uploads are screened by an administrator before they affect charts, alerts, or forecasts.
                </p>
              </div>
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

            <label className="mt-4 grid gap-2 text-sm">
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-bapi-evergreen/62">
                One row should represent one commodity in one market for one week.
              </p>
              <button
                type="submit"
                disabled={upload.isPending}
                className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-bapi-evergreen/40"
              >
                {upload.isPending ? "Submitting..." : "Submit for review"}
              </button>
            </div>

            {submissionSummary ? (
              <div className="mt-5 rounded-[1.4rem] border border-bapi-jade/20 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">
                      Submission received
                    </p>
                    <p className="mt-2 font-semibold text-bapi-evergreen">
                      {submissionSummary.fileName}
                    </p>
                  </div>
                  <StatusPill tone="jade">{submissionSummary.status}</StatusPill>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-bapi-evergreen/72">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Total rows
                    </p>
                    <p className="mt-1 font-semibold">{submissionSummary.totalRows}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Pending review
                    </p>
                    <p className="mt-1 font-semibold">{submissionSummary.validRows}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                      Rejected rows
                    </p>
                    <p className="mt-1 font-semibold">{submissionSummary.invalidRows}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">
                  {upload.data?.message}
                </p>
                {upload.data?.failures.length ? (
                  <p className="mt-3 text-sm leading-6 text-amber-700">
                    {upload.data.failures.length} row(s) were excluded before the batch entered review.
                  </p>
                ) : null}
              </div>
            ) : null}

            {upload.error ? (
              <p className="mt-4 rounded-[1.2rem] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {upload.error.message}
              </p>
            ) : null}
          </form>

          <div className="grid gap-4">
            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">How review works</h3>
                  <p className="text-sm text-bapi-evergreen/68">
                    Upload first, verify later, publish only after approval.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "Submitted rows enter a pending review queue instead of the live dataset.",
                  "Administrators compare the upload against approved markets, commodities, and date formats.",
                  "Only approved rows are merged into weekly statistics, alerts, comparisons, and forecasts.",
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
                    {data.scopeSummary.markets.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bapi-evergreen">Commodities</p>
                  <p className="mt-2 text-sm leading-6 text-bapi-evergreen/68">
                    {data.scopeSummary.commodities.join(", ")}
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
