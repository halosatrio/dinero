/* eslint-disable @typescript-eslint/unbound-method */
import axios, {
  type AxiosInstance,
  type AxiosPromise,
  type Cancel,
  type AxiosError,
  type AxiosRequestConfig,
  type Canceler,
} from "axios";

export type { Canceler };

const didAbort = (error: unknown): error is Cancel & { aborted: boolean } =>
  axios.isCancel(error);

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error: unknown): error is ApiError => {
  return axios.isAxiosError(error);
};

const withAbort = <T>(fn: WithAbortFn) => {
  const executor: ApiExecutor<T> = async (...args: ApiExecutorArgs) => {
    const originalConfig = args[args.length - 1] as ApiRequestConfig;

    const { abort, ...config } = originalConfig;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn<T>(url, body, config);
      } else {
        const [url] = args;
        return await fn<T>(url, config);
      }
    } catch (error: unknown) {
      if (didAbort(error)) error.aborted = true;

      throw error;
    }
  };

  return executor;
};

const withLogger = async <T>(promise: AxiosPromise<T>) =>
  promise.catch((error: ApiError) => {
    if (!import.meta.env.VITE_DEBUG_API) throw error;
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);

    throw error;
  });

// Main api function
export const api = (axiosInstance: AxiosInstance) => {
  return {
    get: <T>(url: string, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axiosInstance.get)(url, config)),
    delete: <T>(url: string, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axiosInstance.delete)(url, config)),
    post: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axiosInstance.post)(url, body, config)),
    patch: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axiosInstance.patch)(url, body, config)),
    put: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
      withLogger<T>(withAbort<T>(axiosInstance.put)(url, body, config)),
  };
};

// api types and interface
export interface ErrorResponse {
  message: string;
  response: {
    data: {
      message: {
        en: string;
        id: string;
      };
    };
  };
}

type AxiosMethods = Pick<
  AxiosInstance,
  "get" | "put" | "patch" | "post" | "delete"
>;
export type WithAbortFn = AxiosMethods[keyof AxiosMethods];

export interface ApiExecutor<T> {
  (url: string, body: unknown, config: ApiRequestConfig): AxiosPromise<T>;
  (url: string, config: ApiRequestConfig): AxiosPromise<T>;
}
export type ApiExecutorArgs =
  | [string, unknown, ApiRequestConfig]
  | [string, ApiRequestConfig];

export type ApiRequestConfig = AxiosRequestConfig & {
  abort?: (cancel: Canceler) => void;
};

export type ApiError = AxiosError & {
  aborted?: boolean;
};
