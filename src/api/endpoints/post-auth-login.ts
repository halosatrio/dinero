import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";

export const postAuthLogin = (
  bodyPayload: PostAuthLoginPayload,
  config: ApiRequestConfig
) =>
  api(axiosInstance)
    .post<PostAuthLoginResponse>(`/auth/login`, bodyPayload, config)
    .then((res) => res.data);

// types response
export type PostAuthLoginResponse = {
  status: number;
  message: string;
  data: string;
};

export type PostAuthLoginPayload = {
  email: string;
  password: string;
};
