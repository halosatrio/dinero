export const CATEGORY = [
  "income",
  "makan",
  "cafe",
  "errand",
  "utils",
  "bensin",
  "olahraga",
  "belanja",
  "family",
  "misc",
  "transport",
  "traveling",
  "date",
  "healthcare",
  "savings",
] as const;

export type CategoryType = (typeof CATEGORY)[number];
