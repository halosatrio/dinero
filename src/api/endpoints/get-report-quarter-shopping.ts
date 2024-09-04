import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";

export const getReportQuarterShopping = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterShoppingRes>(`/report/quarter/shopping`, config)
    .then((res) => res.data);

// data types params and response
export type QuarterShoppingParams = {
  year: number;
  q: 1 | 2 | 3 | 4;
};

export type GetReportQuarterShoppingRes = {
  status: number;
  message: string;
  data: any;
};
