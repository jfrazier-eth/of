import got from "got";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ok } from "neverthrow";
import { parseClientError } from "./errors";
import { mergeOptions } from "./merge-options";

import { getDefaultClientOptions, RequestAdapter, Response } from "./types";

export const adapter: RequestAdapter<unknown, unknown> = async (request, expectedStatus) => {
  const url = request.url.toString();
  const defaults = getDefaultClientOptions();
  const options = mergeOptions(defaults, request);

  let agent;
  if (options.proxy) {
    agent = new HttpsProxyAgent(options.proxy);
  }

  try {
    const response = await got(url, {
      method: options.method,
      throwHttpErrors: false,
      responseType: options.responseType,
      headers: options.headers,
      body: options.json ? JSON.stringify(options.json) : undefined,
      http2: false,
      agent: {
        https: agent,
      },
      https: {
        rejectUnauthorized: !options.proxy?.includes("127.0.0.1"),
      },
    });

    const res: Response<unknown> = {
      status: response.statusCode,
      body: response.body,
      headers: response.headers,
    };

    if (res.status === expectedStatus) {
      return ok(res);
    }

    return parseClientError(options, response);
  } catch (err) {
    return parseClientError(options, err)
  }
};
