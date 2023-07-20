import { mergeOptions } from "./merge-options";
import { RequestAdapter, Response, getDefaultClientOptions } from "./types";

export const adapter: RequestAdapter<unknown, unknown> = async (request) => {
  const url = request.url.toString();

  const options = mergeOptions(getDefaultClientOptions(), request);

  try {
    let reqHeaders = options.headers ?? {};

    const response = await fetch(url.toString(), {
      method: request.method,
      headers: reqHeaders,
      body: options.json ? JSON.stringify(options.json) : null,
    });

    let body;
    switch (options.responseType) {
      case "text": {
        body = response.body;
        break;
      }
      case "json": {
        body = await response.json();
        break;
      }
    }

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

    const res: Response = {
      status: response.status,
      body: body,
      headers: headers,
    };

    return res;
  } catch (err) {
    throw err;
  }
};
