import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";
import { CategoryType } from "@/helper/constant";

export const getReportQuarterEssentials = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterEssentialsRes>(`/report/quarter/essentials`, config)
    .then((res) => res.data);

export type GetReportQuarterEssentialsRes = {
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
