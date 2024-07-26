import { api, type ApiRequestConfig } from "@/api";

import { type CategoryType } from "@/helper/constant";
import axiosInstance from "@/api/endpoints/instance";

export const getMonthlySummary = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetMonthlySummaryResponse>(`/transaction/monthly-summary`, config)
    .then((res) => res.data);

// types response
export type GetMonthlySummaryResponse = {
  status: number;
  message: string;
  data: {
    cashflow: MonthlyCashflowData;
    summary: MonthlySummaryData[];
  };
};

export type MonthlySummaryData = {
  total_amount: number;
  category: CategoryType;
  count: number;
};

export type MonthlyCashflowData = {
  inflow: number;
  outflow: number;
};
