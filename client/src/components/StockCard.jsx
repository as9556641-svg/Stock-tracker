import { formatCurrency, formatNumber, formatSignedCurrency } from "../utils/formatters";

function StockCard({ stock, onDelete, onEdit, onRefresh, deletingId, refreshingId }) {
  const quantity = Number(stock.quantity) || 0;
  const currentPrice = Number(stock.price) || 0;
  const buyPrice = Number(stock.averageCost) || 0;
  const totalValue = quantity * currentPrice;
  const profitLoss = (currentPrice - buyPrice) * quantity;
  const isPositive = profitLoss >= 0;

  return (
    <article className="min-w-[300px] max-w-full overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] dark:border-[#334155] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.98),rgba(15,23,42,0.95))] dark:shadow-[0_24px_52px_rgba(2,6,23,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex rounded-full border border-cyan-200/80 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
            {stock.symbol}
          </div>
          <h3 className="mt-3 truncate font-display text-2xl font-bold text-slate-900 dark:text-[#f1f5f9]">
            {stock.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            Updated {stock.priceUpdatedAt ? new Date(stock.priceUpdatedAt).toLocaleDateString() : "recently"}
          </p>
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

      <div className="mt-4 rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(240,249,255,0.8),rgba(248,250,252,0.92))] px-4 py-4 dark:border-[#334155] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.88))]">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shares Held</p>
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
