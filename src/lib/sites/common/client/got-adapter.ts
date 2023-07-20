import got from "got";

import { RequestAdapter, Response } from "./types";

export const adapter: RequestAdapter<unknown, unknown> = async (request) => {
  const url = request.url.toString();

  try {
    const response = await got(url, {
      method: request.method,
      throwHttpErrors: request.throwHttpErrors,
      responseType: request.responseType,
      // cookieJar: request.cookieJar,
      headers: request.headers,
      body: request.json ? JSON.stringify(request.json) : undefined,
      agent: {
        https: request.httpsAgent,
      },
      https: {
        rejectUnauthorized: request.rejectUnauthorized ?? true,
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
