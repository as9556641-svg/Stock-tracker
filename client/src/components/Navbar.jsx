import { NavLink } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur transition-colors duration-300 dark:border-[#334155] dark:bg-[#0f172a]/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">Portfolio</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-[#f1f5f9]">
            Stock Portfolio Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-100/80 p-1 shadow-[0_10px_24px_rgba(148,163,184,0.12)] dark:border-[#334155] dark:bg-[#1e293b] dark:shadow-[0_14px_32px_rgba(2,6,23,0.34)] sm:flex">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/profile", label: "Profile" }
            ].map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-[0_10px_20px_rgba(148,163,184,0.18)] dark:bg-[#0f172a] dark:text-[#f1f5f9]"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-[#f1f5f9]"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden rounded-2xl border border-slate-200/70 bg-slate-100 px-4 py-2 text-right shadow-[0_10px_24px_rgba(148,163,184,0.12)] dark:border-[#334155] dark:bg-[#1e293b] dark:shadow-[0_14px_32px_rgba(2,6,23,0.34)] sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-[#f1f5f9]">
              {user?.name || "Investor"}
            </p>
          </div>
          <ThemeToggle />
          <button className="btn-secondary" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
