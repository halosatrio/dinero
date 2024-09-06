import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";
import { CategoryType } from "@/helper/constant";

export const getReportQuarterNonEssentials = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterNonEssentialsRes>(
      `/report/quarter/non-essentials`,
      config
    )
    .then((res) => res.data);

// data types params and response
export type QuarterNonEssentialsParams = {
  year: number;
  q: 1 | 2 | 3 | 4;
};

export type GetReportQuarterNonEssentialsRes = {
  status: number;
  message: string;
  data: Array<{
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
  }>;
};
