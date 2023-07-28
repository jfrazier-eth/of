import { ok } from "neverthrow";
import { parseClientError } from "./errors";
import { mergeOptions } from "./merge-options";
import {
  Response as ClientResponse,
  RequestAdapter,
  ResponseType,
  getDefaultClientOptions,
} from "./types";

const parseHeaders = (response: Response) => {
  let headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    if (key in headers) {
      const existingHeader = headers[key];
      if (typeof existingHeader === "string") {
        headers[key] = [existingHeader, value];
      } else if (Array.isArray(existingHeader)) {
        existingHeader.push(value);
      } else {
        console.assert(
          true,
          `Unexpected state encountered. Existing header ${existingHeader} Type: ${typeof existingHeader}`
        );
      }
    } else {
      headers[key] = value;
    }
  });
  return headers;
};

export const parseBody = async (response: Response, responseType: ResponseType) => {
  switch (responseType) {
    case "text": {
      return response.body;
    }
    case "json": {
      return await response.json();
    }
  }
};

export const adapter: RequestAdapter<unknown, unknown> = async (request, expectedStatus) => {
  const url = request.url.toString();
  const defaults = getDefaultClientOptions();
  const options = mergeOptions(defaults, request);
  let reqHeaders = options.headers ?? {}

  try {
    const response = await fetch(url.toString(), {
      method: request.method,
      headers: reqHeaders,
      body: options.json ? JSON.stringify(options.json) : null,
    });

    const res: ClientResponse = {
      status: response.status,
      body: parseBody(response, options.responseType),
      headers: parseHeaders(response),
    };

    if (res.status === expectedStatus) {
      return ok(res);
    }

    return parseClientError(options, response);
  } catch (err) {
    return parseClientError(options, err)
  }
};
