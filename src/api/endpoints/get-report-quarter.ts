import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";
import { CategoryType } from "@/helper/constant";

// ESSENTIALS
export const getReportQuarterEssentials = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterRes>(`/report/quarter/essentials`, config)
    .then((res) => res.data);

// NON ESSENTIALS
export const getReportQuarterNonEssentials = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterRes>(`/report/quarter/non-essentials`, config)
    .then((res) => res.data);

// BELANJA
export const getReportQuarterShopping = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterShoppingRes>(`/report/quarter/shopping`, config)
    .then((res) => res.data);

// data types params and response
export type QuarterReportParams = {
  year: number;
  q: 1 | 2 | 3 | 4;
};

export type GetReportQuarterRes = {
  status: number;
  message: string;
  data: {
    month1: {
      category: CategoryType;
      amount: number;
    };
    month2: {
      category: CategoryType;
      amount: number;
    };
    month3: {
      category: CategoryType;
      amount: number;
    };
  };
};

export type GetReportQuarterShoppingRes = {
  status: number;
  message: string;
  data: {
    month1: number;
    month2: number;
    month3: number;
  };
};
