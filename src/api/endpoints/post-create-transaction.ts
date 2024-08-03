import { api, type ApiRequestConfig } from "@/api";

import { type CategoryType } from "@/helper/constant";
import axiosInstance from "@/api/endpoints/instance";

export const postCreateTransaction = (
  bodyPayload: PostCreateTransactionPayload,
  config: ApiRequestConfig
) =>
  api(axiosInstance)
    .post<PostCreateTransactionResponse>(
      `/transaction/create`,
      bodyPayload,
      config
    )
    .then((res) => res.data);

// types response
export type PostCreateTransactionResponse = {
  status: number;
  message: string;
  data: PostCreateTransactionData;
};

export type PostCreateTransactionPayload = {
  date: string | Date;
  type: "inflow" | "outflow";
  amount: number;
  category: string;
  notes: string;
};

export type PostCreateTransactionData = {
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
