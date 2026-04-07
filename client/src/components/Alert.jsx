function Alert({ type = "error", message }) {
  const tone =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${tone}`}>{message}</div>;
}

export default Alert;
