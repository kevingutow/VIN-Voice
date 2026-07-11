export function formatMileage(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toLocaleString()} mi` : value;
}

export function formatPrice(value: string) {
  const n = Number(value);
  return Number.isFinite(n)
    ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : value;
}
