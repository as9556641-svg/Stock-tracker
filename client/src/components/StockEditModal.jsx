import { useEffect, useState } from "react";

function StockEditModal({ stock, isOpen, onClose, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    averageCost: ""
  });

  useEffect(() => {
    if (!stock) {
      return;
    }

    setFormData({
      name: stock.name,
      quantity: String(stock.quantity),
      averageCost: String(stock.averageCost)
    });
  }, [stock]);

  if (!isOpen || !stock) {
    return null;
  }

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        className="panel relative w-full max-w-lg animate-[fade-in_0.2s_ease-out] p-6 dark:border-slate-800/80 dark:bg-slate-900/90"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Edit</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Update {stock.symbol}
            </h3>
          </div>
          <button className="btn-secondary" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Company Name
            </span>
            <input
              className="input"
              name="name"
              onChange={handleChange}
              required
              value={formData.name}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Quantity
              </span>
              <input
                className="input"
                min="1"
                name="quantity"
                onChange={handleChange}
                required
                step="1"
                type="number"
                value={formData.quantity}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Average Buy Price
              </span>
              <input
                className="input"
                min="0"
                name="averageCost"
                onChange={handleChange}
                required
                step="0.01"
                type="number"
                value={formData.averageCost}
              />
            </label>
          </div>
        </div>

        <button className="btn-primary mt-6 w-full sm:w-auto" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default StockEditModal;
