import { Result } from "neverthrow";

import { ClientErrors } from "./errors";
import { adapter as defaultAdapter } from "./fetch-adapter";
import { mergeOptions } from "./merge-options";
import { ClientOptions, RequestAdapter, RequestOptions, Response } from "./types";

export let adapter = defaultAdapter;

export const setAdapter = (newAdapter: RequestAdapter<unknown, unknown>) => {
  adapter = newAdapter;
};

export const request = async <ReqBody, ResBody>(
  options: RequestOptions<ReqBody>,
  expectedStatus: number
): Promise<Result<Response<ResBody>, ClientErrors>> => {
  return (await adapter(options, expectedStatus)) as Result<Response<ResBody>, ClientErrors>;
};

export const getClient = (clientOptions: ClientOptions) => {
  return {
    clientOptions,
    get: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {},
      expectedStatus = 200
    ) => {
      return await request<unknown, ResBody>(
        {
          ...mergeOptions(clientOptions, options),
          method: "GET",
          url: url,
          json: options.json,
        },
        expectedStatus
      );
    },

    post: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {},
      expectedStatus = 200
    ) => {
      return await request<unknown, ResBody>(
        {
          ...mergeOptions(clientOptions, options),
          method: "POST",
          url: url,
          json: options.json,
        },
        (expectedStatus = 200)
      );
    },

    put: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {},
      expectedStatus = 200
    ) => {
      return await request<unknown, ResBody>(
        {
          ...mergeOptions(clientOptions, options),
          method: "PUT",
          url: url,
          json: options.json,
        },
        expectedStatus
      );
    },

    patch: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {},
      expectedStatus = 200
    ) => {
      return await request<unknown, ResBody>(
        {
          ...mergeOptions(clientOptions, options),
          method: "PATCH",
          url: url,
          json: options.json,
        },
        expectedStatus
      );
    },

    delete: async <ResBody = unknown>(
      url: string | URL,
      options: Omit<RequestOptions, "method" | "url"> = {},
      expectedStatus = 200
    ) => {
      return await request<unknown, ResBody>(
        {
          ...mergeOptions(clientOptions, options),
          method: "DELETE",
          url: url,
          json: options.json,
        },
        expectedStatus
      );
    },
  };
};

export type Client = ReturnType<typeof getClient>;

export { RequestError, ResponseError, ResponseErrorKind } from "./errors";
export type { ClientErrors } from "./errors";
