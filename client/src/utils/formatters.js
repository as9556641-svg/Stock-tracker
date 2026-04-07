export function formatCurrency(value) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCompactCurrency(value) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatSignedCurrency(value) {
  const amount = Number(value);
  const sign = amount >= 0 ? "+" : "-";

  return `${sign}${formatCurrency(Math.abs(Number.isFinite(amount) ? amount : 0))}`;
}

export function formatNumber(value, maximumFractionDigits = 2) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
