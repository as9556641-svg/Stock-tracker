function SummaryCard({ title, value, helper, tone = "default" }) {
  const toneStyles = {
    default:
      "from-white via-slate-50 to-slate-100 text-slate-900 dark:from-[#1e293b] dark:via-[#172131] dark:to-[#1e293b]",
    success:
      "from-green-50 via-emerald-50 to-teal-50 text-green-800 dark:from-[#1e293b] dark:via-[#15342f] dark:to-[#1e293b]",
    danger:
      "from-red-50 via-rose-50 to-orange-50 text-red-700 dark:from-[#1e293b] dark:via-[#332029] dark:to-[#1e293b]"
  };

  return (
    <div
      className={`panel h-full bg-gradient-to-br p-6 ${toneStyles[tone] || toneStyles.default}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">
        {title}
      </p>
      <h3 className="currency-value mt-4 font-display text-3xl font-bold text-slate-900 dark:text-[#f1f5f9]">
        {value}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}

export default SummaryCard;
