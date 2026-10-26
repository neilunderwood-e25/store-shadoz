export type Money = {
  amount: string;
  currencyCode: string;
};

// The design writes prices as "LKR 10,000": currency code, then whole units with thousands separators.
export function formatMoney({ amount, currencyCode }: Money) {
  const value = Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${currencyCode} ${value}`;
}
