import type { PropsWithChildren } from "react";
import {
  Bell,
  ChartColumnIncreasing,
  Database,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Menu,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useCurrentUser, useLogout } from "../../hooks/use-phase9-data";
import { BapiLogo } from "../brand/bapi-logo";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: MapPinned },
  { to: "/analytics", label: "Analytics", icon: ChartColumnIncreasing },
  { to: "/forecasts", label: "Forecasts", icon: LineChart },
  { to: "/admin", label: "Admin", icon: Database },
];

export function AppShell({ children }: PropsWithChildren) {
  const { data: currentUser } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bapi-cream text-bapi-evergreen">
      <div className="bapi-background" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 md:px-6 lg:flex-row lg:gap-6 lg:px-8">
        <aside className="glass-panel mb-4 flex flex-col gap-6 rounded-[2rem] p-5 lg:mb-0 lg:w-[300px] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <BapiLogo />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/40 bg-white/55 text-bapi-evergreen shadow-soft lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-white/40 bg-[linear-gradient(135deg,rgba(15,58,47,0.9),rgba(15,58,47,0.72))] p-5 text-white shadow-soft">
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/70">
              Monitoring Scope
            </p>
            <h2 className="mt-3 font-display text-2xl leading-tight">
              Benue markets, weekly prices, explainable insight.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/78">
              Built for Makurdi, Gboko, Zaki Biam, and Otukpo across eight
              approved commodities only.
            </p>
          </div>

          <nav className="grid gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-bapi-evergreen text-white shadow-soft"
                        : "bg-white/45 text-bapi-evergreen/78 hover:bg-white/75",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[1.6rem] border border-bapi-mint/55 bg-bapi-mint/20 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-bapi-jade/15 text-bapi-jade">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Explainability First</p>
                <p className="text-sm text-bapi-evergreen/68">
                  Rule-based alerts remain the primary decision support layer.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-4">
          <header className="glass-panel flex flex-col gap-4 rounded-[2rem] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-bapi-jade">
                Web-Based Agricultural Market Price Monitoring and Analysis
              </p>
              <h1 className="mt-2 font-display text-3xl leading-tight text-bapi-evergreen md:text-[2.6rem]">
                Premium monitoring for Benue agricultural price insight.
              </h1>
            </div>

            <div className="grid gap-3 rounded-[1.6rem] border border-white/50 bg-white/55 px-4 py-3 text-sm text-bapi-evergreen/72 md:min-w-[280px]">
              <div className="flex items-center justify-between gap-3">
                <span>{currentUser ? currentUser.role : "Guest Access"}</span>
                <span className="rounded-full bg-bapi-jade/15 px-3 py-1 text-xs font-semibold text-bapi-jade">
                  {currentUser ? currentUser.fullName : "BAPI Platform"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Forecasting</span>
                <span>Enabled</span>
              </div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-bapi-evergreen px-3 py-2 text-xs font-semibold text-white"
                >
                  Sign out
                </button>
              ) : null}
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
