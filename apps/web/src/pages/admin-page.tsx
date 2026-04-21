import { ShieldCheck, Upload, WandSparkles } from "lucide-react";

import { QueryState } from "../components/ui/query-state";
import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useAdminData, useCurrentUser } from "../hooks/use-phase9-data";

export function AdminPage() {
  const { data, isLoading } = useAdminData();
  const { data: currentUser } = useCurrentUser();

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
            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-jade/14 text-bapi-jade">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">CSV Import Zone</h3>
                  <p className="text-sm text-bapi-evergreen/68">Upload weekly market price records using the approved BAPI template.</p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-6 text-center text-sm text-bapi-evergreen/58">
                Import workspace for validated weekly CSV submissions
              </div>
            </article>

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
                      : "Admin writes, viewer reads. Sign in to activate protected actions."}
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
