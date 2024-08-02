import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";

export const deleteTransaction = (id: number, config: ApiRequestConfig) =>
  api(axiosInstance)
    .delete<DeleteTransactionResponse>(`/transaction/${id}`, config)
    .then((res) => res.data);

// types response
export type DeleteTransactionResponse = {
  status: number;
  message: string;
};
