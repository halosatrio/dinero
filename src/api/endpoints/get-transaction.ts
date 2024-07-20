import { api, type ApiRequestConfig } from "@/api";

import { type CategoryType } from "@/helper/constant";
import axiosInstance from "@/api/endpoints/instance";

export const getTransaction = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetTransactionResponse>(`/transaction`, config)
    .then((res) => res.data);

// types response
export type GetTransactionResponse = {
  status: number;
  message: string;
  data: GetTransactionData[];
};

export type GetTransactionData = {
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
