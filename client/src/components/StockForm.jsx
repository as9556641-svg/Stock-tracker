const initialForm = {
  name: "",
  symbol: "",
  quantity: "",
  price: "",
  averageCost: ""
};

function StockForm({
  formData,
  onChange,
  onSubmit,
  loading,
  onReset,
  onFetchQuote,
  priceReadOnly,
  quoteLoading,
  quoteError,
  symbolError,
  formSuccess,
  disableSubmit
}) {
  const hasLivePrice = Boolean(formData.price);
  const livePriceMessage = quoteLoading
    ? "Fetching the latest market quote..."
    : quoteError
      ? quoteError
      : hasLivePrice
        ? `Live quote ready for ${formData.symbol || "this symbol"}`
        : "Enter a stock symbol to load the latest live price automatically.";
  const currentPriceLabel = priceReadOnly ? "Current Price (Live)" : "Current Price (Editable)";

  return (
    <form className="panel overflow-hidden p-7 sm:p-8" onSubmit={onSubmit}>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-100/70 via-white to-emerald-100/60 blur-2xl dark:from-cyan-500/10 dark:via-transparent dark:to-emerald-500/10" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Add Position</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-[#f1f5f9]">
            New stock entry
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add a new holding with a live quote and a clean, finance-style entry flow.
          </p>
        </div>
        <button className="btn-secondary" onClick={onReset} type="button">
          Clear
        </button>
      </div>

      <div className="relative mt-8 rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-slate-700/80 dark:bg-slate-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Live Market Feed</p>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {quoteLoading ? "Updating live price..." : "Live Price"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:min-w-[180px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              Latest Quote
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {hasLivePrice ? formData.price : "--"}
            </p>
          </div>
        </div>

        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
            quoteError
              ? "border border-red-200 bg-red-50 text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300"
              : quoteLoading
                ? "border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/25 dark:bg-cyan-500/10 dark:text-cyan-200"
                : hasLivePrice
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400"
          }`}
        >
          {livePriceMessage}
        </p>
      </div>

      <div className="relative mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Company Name</span>
          <input
            className="input"
            name="name"
            onChange={onChange}
            placeholder="Apple Inc."
            required
            value={formData.name}
          />
        </label>

        <label className="block space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Symbol</span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Uppercase only
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className={`input min-w-0 flex-1 font-semibold uppercase tracking-[0.16em] text-slate-950 dark:text-white ${symbolError ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:ring-red-500/20" : ""}`}
              maxLength="10"
              name="symbol"
              onChange={onChange}
              placeholder="AAPL"
              required
              spellCheck="false"
              value={formData.symbol}
            />
            <button
              className="btn-secondary min-w-[148px] whitespace-nowrap"
              disabled={quoteLoading || Boolean(symbolError) || !formData.symbol.trim()}
              onClick={onFetchQuote}
              type="button"
            >
              {quoteLoading ? "Fetching..." : "Refresh Price"}
            </button>
          </div>
          <p className={`text-xs ${symbolError ? "text-red-500 dark:text-red-300" : "text-slate-500 dark:text-slate-400"}`}>
            {symbolError || "Examples: AAPL, MSFT, TATA, RELIANCE"}
          </p>
        </label>

        <label className="block space-y-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Quantity</span>
          <input
            className="input"
            min="1"
            name="quantity"
            onChange={onChange}
            placeholder="10"
            required
            step="1"
            type="number"
            value={formData.quantity}
          />
        </label>

        <label className="block space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              {currentPriceLabel}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                priceReadOnly ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"
              }`}
            >
              {priceReadOnly ? "Auto-filled" : "Manual fallback"}
            </span>
          </div>
          <input
            className={`input font-semibold ${quoteLoading ? "border-cyan-300 bg-cyan-50/70 dark:border-cyan-500/40 dark:bg-cyan-500/5" : ""} ${!priceReadOnly ? "border-amber-300 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-500/10" : ""}`}
            min="0"
            name="price"
            onChange={onChange}
            placeholder={quoteLoading ? "Fetching live price..." : priceReadOnly ? "190" : "Enter current price manually"}
            required
            readOnly={priceReadOnly}
            step="0.01"
            type="number"
            value={formData.price}
          />
        </label>

        <label className="block space-y-2 sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Average Buy Price</span>
          <input
            className="input"
            min="0"
            name="averageCost"
            onChange={onChange}
            placeholder="160"
            required
            step="0.01"
            type="number"
            value={formData.averageCost}
          />
        </label>
      </div>

      {formSuccess ? (
        <p className="relative mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          {formSuccess}
        </p>
      ) : (
        <p className="relative mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add the symbol first, wait for the live quote to appear, then finish the rest of the position details.
        </p>
      )}

      <button className="btn-primary relative mt-7 w-full sm:w-auto" disabled={loading || disableSubmit} type="submit">
        {loading ? "Adding stock..." : "Add Stock"}
      </button>
    </form>
  );
}

StockForm.initialValues = initialForm;

export default StockForm;
