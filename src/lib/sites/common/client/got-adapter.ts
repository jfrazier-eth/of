import got from "got";
import { HttpsProxyAgent } from "https-proxy-agent";

import { RequestAdapter, Response } from "./types";

export const adapter: RequestAdapter<unknown, unknown> = async (request) => {
  const url = request.url.toString();

  const proxy = process.env.HTTPS_PROXY;
  let agent;
  if (proxy) {
    agent = new HttpsProxyAgent(proxy);
  }

  try {
    const response = await got(url, {
      method: request.method,
      throwHttpErrors: request.throwHttpErrors,
      responseType: request.responseType,
      headers: request.headers,
      body: request.json ? JSON.stringify(request.json) : undefined,
      agent: {
        https: agent,
      },
      https: {
        rejectUnauthorized: !proxy?.includes("127.0.0.1"),
      },
    });

    const res: Response<unknown> = {
      status: response.statusCode,
      body: response.body,
      headers: response.headers,
    };

    return res;
  } catch (err) {
    throw err;
  }
};
