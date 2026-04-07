import { formatCurrency, formatNumber, formatSignedCurrency } from "../utils/formatters";

function StockCard({ stock, onDelete, onEdit, onRefresh, deletingId, refreshingId }) {
  const quantity = Number(stock.quantity) || 0;
  const currentPrice = Number(stock.price) || 0;
  const buyPrice = Number(stock.averageCost) || 0;
  const totalValue = quantity * currentPrice;
  const profitLoss = (currentPrice - buyPrice) * quantity;
  const isPositive = profitLoss >= 0;

  return (
    <article className="min-w-[300px] max-w-full overflow-hidden rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)] dark:border-[#334155] dark:bg-[#1e293b] dark:shadow-[0_20px_44px_rgba(2,6,23,0.38)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:border-[#334155] dark:bg-[#0f172a] dark:text-slate-300">
            {stock.symbol}
          </div>
          <h3 className="mt-3 truncate font-display text-2xl font-bold text-slate-900 dark:text-[#f1f5f9]">
            {stock.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f1f5f9] dark:hover:bg-slate-800"
            onClick={() => onEdit(stock)}
            type="button"
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f1f5f9] dark:hover:bg-slate-800"
            disabled={refreshingId === stock._id}
            onClick={() => onRefresh(stock._id)}
            type="button"
          >
            {refreshingId === stock._id ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition duration-200 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
            disabled={deletingId === stock._id}
            onClick={() => onDelete(stock._id)}
            type="button"
          >
            {deletingId === stock._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-[#0f172a]/70">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shares</p>
        <p className="currency-value mt-2 text-lg font-bold text-slate-900 dark:text-[#f1f5f9]">
          {formatNumber(quantity, 0)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 overflow-hidden">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 dark:border-[#334155] dark:bg-[#0f172a]/70">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
            Current Price
          </p>
          <p className="currency-value mt-2 overflow-hidden text-ellipsis text-sm font-bold text-slate-900 dark:text-[#f1f5f9] sm:text-base">
            {formatCurrency(currentPrice)}
          </p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 dark:border-[#334155] dark:bg-[#0f172a]/70">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
            Buy Price
          </p>
          <p className="currency-value mt-2 overflow-hidden text-ellipsis text-sm font-bold text-slate-900 dark:text-[#f1f5f9] sm:text-base">
            {formatCurrency(buyPrice)}
          </p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 dark:border-[#334155] dark:bg-[#0f172a]/70">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
            Total Value
          </p>
          <p className="currency-value mt-2 overflow-hidden text-ellipsis text-sm font-bold text-slate-900 dark:text-[#f1f5f9] sm:text-base">
            {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4 dark:border-[#334155] dark:bg-[#0f172a]/70">
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
            Profit / Loss
          </p>
          <p
            className={`currency-value mt-2 overflow-hidden text-ellipsis text-sm font-bold sm:text-base ${
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatSignedCurrency(profitLoss)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default StockCard;
