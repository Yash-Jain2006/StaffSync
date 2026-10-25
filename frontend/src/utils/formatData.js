export const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateSlash = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const y = d.getFullYear();
  return `${m}/${day}/${y}`;
};

export const formatTime = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};
