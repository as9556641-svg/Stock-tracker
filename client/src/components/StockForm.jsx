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
  quoteLoading,
  quoteError
}) {
  return (
    <form className="panel p-7" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3">
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

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
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

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Symbol</span>
          <div className="flex gap-2">
            <input
              className="input uppercase"
              maxLength="6"
              name="symbol"
              onChange={onChange}
              placeholder="AAPL"
              required
              value={formData.symbol}
            />
            <button className="btn-secondary min-w-[116px] whitespace-nowrap" onClick={onFetchQuote} type="button">
              {quoteLoading ? "Fetching..." : "Live Price"}
            </button>
          </div>
        </label>

        <label className="block">
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

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Current Price</span>
          <input
            className="input"
            min="0"
            name="price"
            onChange={onChange}
            placeholder="190"
            required
            readOnly
            step="0.01"
            type="number"
            value={formData.price}
          />
        </label>

        <label className="block sm:col-span-2">
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

      {quoteError ? (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
          {quoteError}
        </p>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Use the stock symbol to fetch the latest price automatically from the live quote service.
        </p>
      )}

      <button className="btn-primary mt-7 w-full sm:w-auto" disabled={loading} type="submit">
        {loading ? "Adding stock..." : "Add Stock"}
      </button>
    </form>
  );
}

StockForm.initialValues = initialForm;

export default StockForm;
