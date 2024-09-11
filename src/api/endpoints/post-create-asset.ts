import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";

export const postCreateAsset = (
  bodyPayload: PostCreateAssetPayload,
  config: ApiRequestConfig
) =>
  api(axiosInstance)
    .post<PostCreateAssetResponse>(`/asset/create`, bodyPayload, config)
    .then((res) => res.data);

// types response
export type PostCreateAssetResponse = {
  status: number;
  message: string;
  data: PostCreateAssetData;
};

export type PostCreateAssetPayload = {
  account: "BCA" | "BLU" | "BIBIT"; // hardcoded accounts can be changed into dynamic
  amount: number | undefined;
  date: string | Date;
  notes: string | undefined;
};

export type PostCreateAssetData = {
  id: number;
  user_id: number;
  account: "BCA" | "BLU" | "BIBIT";
  amount: number;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
