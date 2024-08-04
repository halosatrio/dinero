import { api, type ApiRequestConfig } from "@/api";

import axiosInstance from "@/api/endpoints/instance";
import { TransactionData } from "./get-transaction";

export const getTransactionDetail = (id: number, config: ApiRequestConfig) =>
  api(axiosInstance)
    .get<GetTransactionDetailResponse>(`/transaction/${id}`, config)
    .then((res) => res.data);

// types response
export type GetTransactionDetailResponse = {
  status: number;
  message: string;
  data: TransactionData;
};
