import { formatCurrency, formatDateTime } from "../utils/formatters";

const actionStyles = {
  ADD: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  UPDATE: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  REFRESH_PRICE: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
};

function TransactionHistory({ transactions }) {
  return (
    <section className="panel p-6 dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">History</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
            Transaction timeline
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {transactions.length ? (
          transactions.map((transaction) => (
            <article
              className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              key={transaction._id}
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                      actionStyles[transaction.action]
                    }`}
                  >
                    {transaction.action.replace("_", " ")}
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {transaction.stockName} ({transaction.stockSymbol})
                  </h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {transaction.note || "Portfolio action"}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                    {transaction.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Buy Price</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(transaction.averageCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Price</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(transaction.price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Value Change</p>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(transaction.amountChanged)}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Your transaction history will appear here after you add, update, refresh, or delete a
            stock.
          </div>
        )}
      </div>
    </section>
  );
}

export default TransactionHistory;
