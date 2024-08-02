import { api, type ApiRequestConfig } from "@/api";

import { type CategoryType } from "@/helper/constant";
import axiosInstance from "@/api/endpoints/instance";

export const postCreateTransaction = (
  bodyPayload: PostTransactionPayload,
  config: ApiRequestConfig
) =>
  api(axiosInstance)
    .post<PostTransactionResponse>(`/transaction/create`, bodyPayload, config)
    .then((res) => res.data);

// types response
export type PostTransactionResponse = {
  status: number;
  message: string;
  data: PostTransactionData;
};

export type PostTransactionPayload = {
  date: string | Date;
  type: "inflow" | "outflow";
  amount: number;
  category: string;
  notes: string;
};

export type PostTransactionData = {
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
