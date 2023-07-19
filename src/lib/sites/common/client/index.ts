import { adapter as kyAdapter } from "./ky-adapter";
import { mergeOptions } from "./merge-options";
import {
  ClientOptions,
  RequestAdapter,
  RequestOptions,
  Response,
} from "./types";

export let adapter = kyAdapter;

export const setAdapter = (adapter: RequestAdapter<unknown, unknown>) => {
  adapter = kyAdapter;
};

export const request = async <ReqBody, ResBody>(
  options: RequestOptions<ReqBody>
): Promise<Response<ResBody>> => {
  return (await adapter(options)) as Response<ResBody>;
};

export const getClient = (clientOptions: ClientOptions) => {
  return {
    clientOptions,
    get: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {}
    ) => {
      return await request<unknown, ResBody>({
        ...mergeOptions(clientOptions, options),
        method: "GET",
        url: url,
        json: options.json,
      });
    },

    post: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {}
    ) => {
      return await request<unknown, ResBody>({
        ...mergeOptions(clientOptions, options),
        method: "POST",
        url: url,
        json: options.json,
      });
    },

    put: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {}
    ) => {
      return await request<unknown, ResBody>({
        ...mergeOptions(clientOptions, options),
        method: "PUT",
        url: url,
        json: options.json,
      });
    },

    patch: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {}
    ) => {
      return await request<unknown, ResBody>({
        ...mergeOptions(clientOptions, options),
        method: "PATCH",
        url: url,
        json: options.json,
      });
    },

    delete: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {}
    ) => {
      return await request<unknown, ResBody>({
        ...mergeOptions(clientOptions, options),
        method: "DELETE",
        url: url,
        json: options.json,
      });
    },
  };
};

export type Client = ReturnType<typeof getClient>;
