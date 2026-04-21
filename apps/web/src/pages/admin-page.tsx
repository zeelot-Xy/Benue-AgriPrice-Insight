import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileSpreadsheet, ShieldCheck, Upload, WandSparkles } from "lucide-react";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import {
  useAdminData,
  useCurrentUser,
  useImportPrices,
} from "../hooks/use-phase9-data";

export function AdminPage() {
  const { data, isLoading } = useAdminData();
  const { data: currentUser } = useCurrentUser();
  const importPrices = useImportPrices();
  const [csvFileName, setCsvFileName] = useState("weekly-price-update.csv");
  const [csvContent, setCsvContent] = useState(
    "market_code,commodity_slug,price_date,price,unit,source_note\nMKD,yam,2026-04-18,6040,bag,Weekly market survey",
  );

  const importSummary = useMemo(() => {
    if (!importPrices.data) {
      return null;
    }

    return importPrices.data.importBatch;
  }, [importPrices.data]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvFileName(file.name);
    setCsvContent(await file.text());
  }

  async function handleImportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await importPrices.mutateAsync({
      fileName: csvFileName,
      csvContent,
    });
  }

  if (isLoading) {
    return (
      <QueryState
        title="Loading Admin Workspace"
        description="Fetching live overview counts and scope metadata from the backend."
      />
    );
  }

  if (!data) {
    return (
      <QueryState
        title="Admin Workspace Unavailable"
        description="No admin summary could be prepared for this screen."
      />
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Admin Workspace"
        title="Controlled data management for weekly market updates"
        description="The admin workspace supports careful data stewardship through manual entry, CSV import, and controlled update workflows."
        action={
          <StatusPill tone={data.source === "live" ? "jade" : "mint"}>
            {data.source === "live" ? "Live Summary" : "Offline Summary"}
          </StatusPill>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3">
            <form
              onSubmit={handleImportSubmit}
              className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">
                    Weekly CSV Import
                  </h3>
                  <p className="text-sm text-bapi-evergreen/68">
                    Submit validated weekly market records using the approved BAPI import format.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-bapi-evergreen">
                    Import file
                  </span>
                  <div className="rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-bapi-jade">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-bapi-evergreen">
                          {csvFileName}
                        </p>
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

                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-bapi-evergreen">
                    CSV content preview
                  </span>
                  <textarea
                    value={csvContent}
                    onChange={(event) => setCsvContent(event.target.value)}
                    rows={8}
                    className="min-h-[200px] rounded-[1.4rem] border border-white/60 bg-white/75 px-4 py-3 font-mono text-xs leading-6 text-bapi-evergreen outline-none"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-[1.4rem] bg-bapi-mint/18 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">
                  Required columns
                </p>
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
                <div className="text-sm text-bapi-evergreen/62">
                  Submit one weekly row per market and commodity combination.
                </div>
                <button
                  type="submit"
                  disabled={!currentUser || importPrices.isPending}
                  className="rounded-full bg-bapi-evergreen px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-bapi-evergreen/40"
                >
                  {importPrices.isPending ? "Submitting import..." : "Import weekly prices"}
                </button>
              </div>

              {importSummary ? (
                <div className="mt-5 rounded-[1.4rem] border border-bapi-jade/20 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">
                        Latest import
                      </p>
                      <p className="mt-2 font-semibold text-bapi-evergreen">
                        {importSummary.fileName}
                      </p>
                    </div>
                    <StatusPill tone="jade">{importSummary.status}</StatusPill>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-bapi-evergreen/72">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                        Total rows
                      </p>
                      <p className="mt-1 font-semibold">{importSummary.totalRows}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                        Imported
                      </p>
                      <p className="mt-1 font-semibold">{importSummary.successRows}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-bapi-evergreen/42">
                        Failed
                      </p>
                      <p className="mt-1 font-semibold">{importSummary.failedRows}</p>
                    </div>
                  </div>
                  {importPrices.data?.failures.length ? (
                    <p className="mt-4 text-sm leading-6 text-amber-700">
                      {importPrices.data.failures.length} row(s) need review before the next submission.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {importPrices.error ? (
                <p className="mt-4 rounded-[1.2rem] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {importPrices.error.message}
                </p>
              ) : null}
            </form>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">Access Control</h3>
                  <p className="text-sm text-bapi-evergreen/68">
                    {currentUser
                      ? `${currentUser.fullName} is authenticated as ${currentUser.role}.`
                      : "Sign in with an admin account to unlock imports and data management actions."}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">
                {data.note}
              </p>
            </article>
          </div>

          <div className="rounded-[1.7rem] border border-white/55 bg-white/62 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">Admin Checklist</p>
                <h3 className="mt-2 font-display text-2xl text-bapi-evergreen">
                  Keep the data clean and the scope controlled.
                </h3>
              </div>
              <StatusPill tone="mint">
                {data.scopeSummary.markets} Markets / {data.scopeSummary.commodities} Commodities
              </StatusPill>
            </div>

            <div className="mt-5 grid gap-3">
              {data.adminTasks.map((task, index) => (
                <article key={task} className="flex items-start gap-4 rounded-[1.4rem] border border-white/55 bg-bapi-cream/72 p-4">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-bapi-jade/15 text-sm font-semibold text-bapi-jade">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-bapi-evergreen/72">{task}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-white/55 bg-white/68 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-bapi-jade">
                    Recent weekly records
                  </p>
                  <p className="mt-2 text-sm text-bapi-evergreen/68">
                    Review the most recent entries before publishing insights.
                  </p>
                </div>
                <StatusPill tone="mint">
                  {data.recentRecords.length} Records
                </StatusPill>
              </div>

              <div className="mt-4 grid gap-3">
                {data.recentRecords.length ? (
                  data.recentRecords.map((record) => (
                    <article
                      key={record.id}
                      className="rounded-[1.2rem] border border-white/55 bg-bapi-cream/72 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-bapi-evergreen">
                            {record.commodity} in {record.market}
                          </p>
                          <p className="text-sm text-bapi-evergreen/58">
                            {record.priceDate}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-bapi-evergreen">
                          {record.price.toLocaleString()} / {record.unit}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-bapi-evergreen/62">
                    Recent price activity will appear here as weekly records are entered or imported.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[1.4rem] bg-[linear-gradient(140deg,rgba(15,58,47,0.92),rgba(15,58,47,0.78))] p-4 text-white">
              <WandSparkles className="h-5 w-5 text-bapi-mint" />
              <p className="text-sm leading-6 text-white/82">
                Reliable analysis begins with clean records, complete coverage, and clear explanations.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
