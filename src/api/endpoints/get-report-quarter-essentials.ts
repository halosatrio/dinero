import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";
import { CategoryType } from "@/helper/constant";

export const getReportQuarterEssentials = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetReportQuarterEssentialsRes>(`/report/quarter/essentials`, config)
    .then((res) => res.data);

// data types params and response
export type QuarterEssentialsParams = {
  year: number;
  q: 1 | 2 | 3 | 4;
};

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

// export type QuarterEssentialsData = {
//   category: "makan" | "errand" | "cafe" | "utils" | "bensin";
//   amount: number;
// };
