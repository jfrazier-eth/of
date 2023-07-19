import { HttpsProxyAgent } from "https-proxy-agent";
import { CookieJar } from "tough-cookie";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE";

export type ClientOptions = {
  throwHttpErrors?: boolean;
  responseType?: "text" | "json";
  cookieJar?: CookieJar;
  rejectUnauthorized?: boolean;
  httpsAgent?: HttpsProxyAgent<string>;
};

export interface RequestOptions<Body = unknown> extends ClientOptions {
  method: HTTPMethod;
  url: URL | string;
  headers?: Record<string, string>;
  json?: Body;
}

export type Response<Body = unknown> = {
  status: number;
  body: Body;
  headers: Record<string, undefined | string | string[]>;
};

export const getDefaultClientOptions = (): ClientOptions => {
  return {
    throwHttpErrors: true,
    responseType: "json",
  };
};

export type RequestAdapter<ReqBody, ResBody> = (
  request: RequestOptions<ReqBody>
) => Promise<Response<ResBody>>;
