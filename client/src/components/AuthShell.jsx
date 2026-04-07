import { Link } from "react-router-dom";

import { formatCurrency, formatSignedCurrency } from "../utils/formatters";

function AuthShell({ title, subtitle, altText, altLink, altLabel, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-soft backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/80 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Stock Portfolio Tracker</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight">
              Track every position with calm, clean clarity.
            </h1>
            <p className="mt-6 max-w-md text-base text-slate-300">
              A beginner-friendly portfolio dashboard with secure auth, quick stock entry, and a
              polished overview of total value and profit or loss.
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <span className="text-sm text-slate-300">Portfolio value</span>
              <span className="font-display text-xl">{formatCurrency(24860)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <span className="text-sm text-slate-300">Today&apos;s move</span>
              <span className="font-semibold text-emerald-300">{formatSignedCurrency(1240)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Welcome</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              {altText}{" "}
              <Link className="font-semibold text-ink hover:text-brand" to={altLink}>
                {altLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
