import { ShieldCheck, Upload, WandSparkles } from "lucide-react";

import { SectionCard } from "../components/ui/section-card";
import { StatusPill } from "../components/ui/status-pill";
import { useAdminData } from "../hooks/use-phase9-data";

export function AdminPage() {
  const { data } = useAdminData();

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <SectionCard
        eyebrow="Admin Workspace"
        title="Controlled data management for demo-safe operations"
        description="The admin interface is intentionally framed around manual entry and CSV import, which keeps the project realistic and defendable."
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
                  <p className="text-sm text-bapi-evergreen/68">Upload the controlled weekly template only.</p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-bapi-evergreen/18 bg-bapi-cream/70 p-6 text-center text-sm text-bapi-evergreen/58">
                Drag-and-drop styling placeholder for Phase 10 integration
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-white/55 bg-white/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-bapi-evergreen/10 text-bapi-evergreen">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-bapi-evergreen">Access Control</h3>
                  <p className="text-sm text-bapi-evergreen/68">Admin writes, viewer reads.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-bapi-evergreen/68">
                This view is prepared for JWT-protected backend actions that will be connected in the next phase.
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
              <StatusPill tone="mint">Phase 10 Ready</StatusPill>
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
                Forecasting stays optional and explainable. Data quality comes first.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
