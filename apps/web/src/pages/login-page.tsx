import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { BapiLogo } from "../components/brand/bapi-logo";
import { useLogin } from "../hooks/use-phase9-data";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("admin@bapi.local");
  const [password, setPassword] = useState("BapiAdmin123!");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login.mutateAsync({ email, password });
    void navigate("/admin");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bapi-cream text-bapi-evergreen">
      <div className="bapi-background" />
      <div className="relative z-10 grid min-h-screen place-items-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-panel rounded-[2.2rem] p-6 md:p-8">
            <BapiLogo />
            <p className="mt-8 text-xs uppercase tracking-[0.28em] text-bapi-jade">Administrator Access</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
              Agricultural market intelligence shaped for Benue State.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-bapi-evergreen/70">
              BAPI brings together weekly price tracking, trend alerts, market comparison, and forecast support in one clear platform for farmers, traders, and decision-makers.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {["Review queued uploads", "Direct CSV import", "Forecast-ready analytics"].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/50 bg-white/60 px-4 py-4 text-sm text-bapi-evergreen/72">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2.2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-bapi-jade">Sign In</p>
            <h2 className="mt-4 font-display text-3xl">Administrator sign in</h2>
            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/60 bg-white/70 px-4 py-3">
                  <UserRound className="h-4 w-4 text-bapi-evergreen/45" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent outline-none placeholder:text-bapi-evergreen/35"
                    placeholder="admin@bapi.local"
                  />
                </div>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Password</span>
                <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/60 bg-white/70 px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-bapi-evergreen/45" />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent outline-none placeholder:text-bapi-evergreen/35"
                    placeholder="Enter your account password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((value) => !value)}
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    className="grid h-8 w-8 place-items-center rounded-full text-bapi-evergreen/55 transition hover:bg-white/70 hover:text-bapi-evergreen"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-[1.4rem] bg-bapi-evergreen px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-bapi-evergreen/92"
                disabled={login.isPending}
              >
                {login.isPending ? "Signing in..." : "Continue to admin workspace"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-5 text-sm leading-6 text-bapi-evergreen/62">
              Sign in to review submitted updates, manage direct imports, and control the approved data used across BAPI.
            </p>
            {login.error ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {login.error.message}
              </p>
            ) : null}

            <Link to="/" className="mt-8 inline-flex text-sm font-semibold text-bapi-jade underline-offset-4 hover:underline">
              Continue to the public dashboard
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
