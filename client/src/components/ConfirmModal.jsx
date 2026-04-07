function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-200"
        onClick={onCancel}
      />
      <div
        aria-modal="true"
        className="relative w-full max-w-md animate-[fade-in_0.2s_ease-out] rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900"
        role="dialog"
      >
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="btn-secondary" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
