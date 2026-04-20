import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/app-shell";

const AdminPage = lazy(() =>
  import("./pages/admin-page").then((module) => ({ default: module.AdminPage })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/analytics-page").then((module) => ({
    default: module.AnalyticsPage,
  })),
);
const DashboardPage = lazy(() =>
  import("./pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);
const ForecastsPage = lazy(() =>
  import("./pages/forecasts-page").then((module) => ({
    default: module.ForecastsPage,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/login-page").then((module) => ({ default: module.LoginPage })),
);
const MarketsPage = lazy(() =>
  import("./pages/markets-page").then((module) => ({ default: module.MarketsPage })),
);

function RouteFallback() {
  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <p className="text-sm uppercase tracking-[0.28em] text-bapi-jade">
        Loading View
      </p>
      <p className="mt-3 text-sm leading-6 text-bapi-evergreen/68">
        Preparing the next BAPI screen.
      </p>
    </div>
  );
}

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ShellLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/forecasts" element={<ForecastsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
