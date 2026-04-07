function Toast({ isVisible = true, message, tone = "success" }) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-white/95 text-red-700 dark:border-red-500/30 dark:bg-slate-900/95 dark:text-red-300"
      : "border-emerald-200 bg-white/95 text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900/95 dark:text-emerald-300";

  return (
    <div
      className={`pointer-events-none transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className={`rounded-2xl border px-4 py-3 shadow-soft backdrop-blur ${toneClass}`}>
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
}

export default Toast;
