#!/usr/bin/env node

const apiBaseUrl = process.env.BAPI_API_BASE_URL ?? "http://localhost:8000";
const webBaseUrl = process.env.BAPI_WEB_BASE_URL ?? "http://localhost:5173";
const adminEmail = process.env.BAPI_ADMIN_EMAIL ?? "admin@bapi.local";
const adminPassword =
  process.env.BAPI_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? "BapiAdmin123!";

const shouldSkipWeb = process.argv.includes("--skip-web");
const shouldSkipAuth = process.argv.includes("--skip-auth");

function line(status, label, detail) {
  console.log(`[${status}] ${label}${detail ? `: ${detail}` : ""}`);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? body.message
        : `HTTP ${response.status}`;
    throw new Error(String(message));
  }

  return body;
}

async function runCheck(label, task) {
  try {
    const detail = await task();
    line("PASS", label, detail);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    line("FAIL", label, message);
    return false;
  }
}

async function main() {
  console.log("BAPI smoke check");
  console.log(`API: ${apiBaseUrl}`);
  console.log(`WEB: ${webBaseUrl}`);

  const checks = [];

  checks.push(
    await runCheck("API health", async () => {
      const body = await fetchJson(`${apiBaseUrl}/health`);
      return `${body.service} ${body.status}`;
    }),
  );

  checks.push(
    await runCheck("API overview", async () => {
      const body = await fetchJson(`${apiBaseUrl}/api`);
      return `${body.name} phase ${body.phase}`;
    }),
  );

  checks.push(
    await runCheck("Reports overview", async () => {
      const body = await fetchJson(`${apiBaseUrl}/api/reports/overview`);
      return `${body.counts.markets} markets, ${body.counts.commodities} commodities`;
    }),
  );

  checks.push(
    await runCheck("Markets endpoint", async () => {
      const body = await fetchJson(`${apiBaseUrl}/api/markets`);
      return `${body.length} market records`;
    }),
  );

  checks.push(
    await runCheck("Analytics alerts endpoint", async () => {
      const body = await fetchJson(`${apiBaseUrl}/api/analytics/alerts`);
      return `${body.count} alert items`;
    }),
  );

  let token = null;

  if (!shouldSkipAuth) {
    checks.push(
      await runCheck("Admin login", async () => {
        const body = await fetchJson(`${apiBaseUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword,
          }),
        });
        token = body.token;
        return body.user.email;
      }),
    );

    checks.push(
      await runCheck("Authenticated user lookup", async () => {
        if (!token) {
          throw new Error("Token was not obtained from login.");
        }

        const body = await fetchJson(`${apiBaseUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return `${body.fullName} (${body.role})`;
      }),
    );
  } else {
    line("SKIP", "Admin login", "Skipped by flag");
  }

  if (!shouldSkipWeb) {
    checks.push(
      await runCheck("Frontend response", async () => {
        const response = await fetch(`${webBaseUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return `HTTP ${response.status}`;
      }),
    );
  } else {
    line("SKIP", "Frontend response", "Skipped by flag");
  }

  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  console.log(`Summary: ${passed}/${total} checks passed`);

  if (passed !== total) {
    process.exitCode = 1;
  }
}

await main();
