import { api, ApiRequestConfig } from "..";
import axiosInstance from "./instance";

export const getAssetRecord = (config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetAssetRecordRes>(`/asset`, config)
    .then((res) => res.data);

export type GetAssetRecordRes = {
  status: number;
  message: string;
  data: Array<{
    id: number;
    user_id: number;
    account: "BCA" | "BLU" | "BIBIT";
    amount: number;
    date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>;
};
