import { err as resultErr } from "neverthrow";

import { Browser } from "../browsers";
import { RequestOptions, Response } from "./types";

const formatProxy = (proxy?: URL | string | null) => {
  return proxy ? `PROXY: ${proxy.toString()}` : "";
};

const formatBrowser = (browser?: Browser) => {
  return `Browser:${browser ? browser.kind : "NONE"}`;
};

const formatURL = (_url: string | URL, isBadRequest: boolean) => {
  const url = typeof _url === "string" ? new URL(_url) : _url;
  const base = `URL: ${url.hostname}${url.pathname}`;
  if (isBadRequest) {
    return `${base} Query: ${url.search}`;
  }
  return base;
};

const formatStatus = (status: number) => {
  return `STATUS: ${status}`;
};

const formatBody = (isRequest: boolean, body?: object | unknown) => {
  return `${isRequest ? "REQ" : "RES"}BODY: ${body ? JSON.stringify(body, null, 2) : "NONE"}`;
};

const formatHeaders = (
  isRequest: boolean,
  headers?: Record<string, string | string[] | undefined>
) => {
  return `${isRequest ? "REQ" : "RES"} HEADERS: ${headers ? JSON.stringify(headers, null, 2) : "NONE"
    }`;
};

export class RequestError extends Error {
  constructor(public request: RequestOptions, public err: any) {
    let message;
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    } else {
      message = `Unknown error: ${err}`;
    }
    super(`RequestError: ${formatURL(request.url, true)} ${message} ${formatProxy(request.proxy)}`);
  }
}

export enum ResponseErrorKind {
  BadRequest = "BAD_REQUEST",
  Unauthorized = "UNAUTHORIZED",
  NotFound = "NOT_FOUND",
  RateLimited = "RATE_LIMITED",
  InternalServerError = "INTERNAL_SERVER_ERROR",
  UnknownError = "UNKNOWN_ERROR",
}

export class ResponseError extends Error {
  public kind: ResponseErrorKind;
  constructor(public request: RequestOptions, public response: Response<unknown>) {
    let message;
    let kind: ResponseErrorKind;
    switch (response.status) {
      case 400:
        kind = ResponseErrorKind.BadRequest;
        message = `${formatStatus(response.status)} ${formatURL(request.url, true)} ${formatBody(
          true,
          request.json
        )} ${formatHeaders(true, request.headers)} ${formatBody(false, response.body)}`;
        break;
      case 401:
      case 403:
        kind = ResponseErrorKind.Unauthorized;
        message = `${formatStatus(response.status)} ${formatURL(
          request.url,
          false
        )} ${formatHeaders(true, request.headers)} ${formatBody(false, response.body)}`;
        break;
      case 404:
        kind = ResponseErrorKind.NotFound;
        message = `${formatStatus(response.status)} ${formatURL(request.url, true)} ${formatHeaders(
          true,
          request.headers
        )}`;
        break;
      case 429:
        kind = ResponseErrorKind.RateLimited;
        message = `${formatStatus(response.status)} ${formatURL(
          request.url,
          false
        )} ${formatHeaders(true, request.headers)} ${formatHeaders(false, response.headers)}`;
        break;

      case 500:
        kind = ResponseErrorKind.InternalServerError;
        message = `${formatStatus(response.status)} ${formatURL(
          request.url,
          false
        )} ${formatHeaders(true, request.headers)} ${formatHeaders(false, response.headers)}`;
        break;
      default:
        kind = ResponseErrorKind.UnknownError;
        message = `${formatStatus(response.status)} ${formatURL(
          request.url,
          false
        )} ${formatHeaders(true, request.headers)} ${formatHeaders(false, response.headers)}`;
        break;
    }
    super(`ResponseError ${kind}: ${message} `);
    this.kind = kind;
  }
}

export type ClientErrors = RequestError | ResponseError;

export const parseClientError = (
  request: RequestOptions,
  err: unknown,
  response?: Response<unknown>
) => {
  if (response) {
    return resultErr(new ResponseError(request, response));
  }
  return resultErr(new RequestError(request, err));
};
