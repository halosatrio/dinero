import { api, type ApiRequestConfig } from "@/api";

import { type CategoryType } from "@/helper/constant";
import axiosInstance from "@/api/endpoints/instance";

export const putUpdateTransaction = (
  id: number,
  bodyPayload: PutUpdateTransactionPayload,
  config: ApiRequestConfig
) =>
  api(axiosInstance)
    .put<PutUpdateTransactionResponse>(
      `/transaction/${id}`,
      bodyPayload,
      config
    )
    .then((res) => res.data);

// types response
export type PutUpdateTransactionResponse = {
  status: number;
  message: string;
  data: PutUpdateTransactionData;
};

export type PutUpdateTransactionPayload = {
  date: string | Date;
  type: "inflow" | "outflow";
  amount: number;
  category: string;
  notes: string;
};

export type PutUpdateTransactionData = {
  id: number;
  user_id: number;
  type: "outflow" | "inflow";
  amount: number;
  category: CategoryType;
  date: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
