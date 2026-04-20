import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { BapiLogo } from "../components/brand/bapi-logo";

export function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bapi-cream text-bapi-evergreen">
      <div className="bapi-background" />
      <div className="relative z-10 grid min-h-screen place-items-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-panel rounded-[2.2rem] p-6 md:p-8">
            <BapiLogo />
            <p className="mt-8 text-xs uppercase tracking-[0.28em] text-bapi-jade">Viewer and Admin Access</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
              Agricultural market intelligence shaped for Benue State.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-bapi-evergreen/70">
              BAPI combines weekly price monitoring, explainable trend analysis, market comparison, and optional forecasting in a calm, premium interface built for farmers, traders, and policymakers.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {["Explainable alerts", "Controlled CSV import", "Forecast-ready UI"].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/50 bg-white/60 px-4 py-4 text-sm text-bapi-evergreen/72">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-bapi-jade">Sign In</p>
            <h2 className="mt-4 font-display text-3xl">Welcome back to BAPI</h2>
            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/60 bg-white/70 px-4 py-3">
                  <UserRound className="h-4 w-4 text-bapi-evergreen/45" />
                  <input className="w-full bg-transparent outline-none placeholder:text-bapi-evergreen/35" placeholder="admin@bapi.local" />
                </div>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Password</span>
                <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/60 bg-white/70 px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-bapi-evergreen/45" />
                  <input
                    type="password"
                    className="w-full bg-transparent outline-none placeholder:text-bapi-evergreen/35"
                    placeholder="Phase 10 will connect this form"
                  />
                </div>
              </label>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-[1.4rem] bg-bapi-evergreen px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-bapi-evergreen/92"
              >
                Continue to dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-bapi-evergreen/62">
              Authentication wiring is scheduled for frontend-backend integration. For now, this screen establishes the final visual tone and UX direction.
            </p>

            <Link to="/" className="mt-8 inline-flex text-sm font-semibold text-bapi-jade underline-offset-4 hover:underline">
              Preview the dashboard shell
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
