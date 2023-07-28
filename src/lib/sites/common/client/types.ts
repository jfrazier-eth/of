import { HttpsProxyAgent } from "https-proxy-agent";
import { Result } from "neverthrow";

import { ClientErrors } from "./errors";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE";
export type ResponseType = "text" | "json";
export type ClientOptions = {
  responseType?: ResponseType;
  rejectUnauthorized?: boolean;
  httpsAgent?: HttpsProxyAgent<string>;
};

export interface RequestOptions<Body = unknown> extends ClientOptions {
  method: HTTPMethod;
  url: URL | string;
  headers?: Record<string, string>;
  json?: Body;
  proxy?: string;
}

export type Response<Body = unknown> = {
  status: number;
  body: Body;
  headers: Record<string, undefined | string | string[]>;
};

export const getDefaultClientOptions = (): {
  responseType: ResponseType;
} => {
  return {
    responseType: "json",
  };
};

export type RequestAdapter<ReqBody, ResBody> = (
  request: RequestOptions<ReqBody>,
  expectedStatusCode: number
) => Promise<Result<Response<ResBody>, ClientErrors>>;
