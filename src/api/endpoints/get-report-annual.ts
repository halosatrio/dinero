import { api, ApiRequestConfig } from "..";
import axiosInstance from "./instance";

export const getReportAnnualCashflow = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportAnnualCashflowRes>(`/report/annual/cashflow`, config)
    .then((res) => res.data);

export type GetReportAnnualCashflowRes = {
  status: number;
  message: string;
  data: {
    monthly: {
      month: number;
      inflow: number;
      outflow: number;
      saving: number;
    }[];
    total: {
      total_inflow: number;
      total_outflow: number;
    };
  };
};
