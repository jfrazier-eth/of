import axios from "axios";

import { mergeOptions } from "./merge-options";
import { RequestAdapter, Response, getDefaultClientOptions } from "./types";

export const adapter: RequestAdapter<unknown, unknown> = async (request) => {
  const url = request.url.toString();

  const options = mergeOptions(getDefaultClientOptions(), request);

  try {
    let reqHeaders = options.headers ?? {};

    const response = await axios(url.toString(), {
      method: request.method,
      headers: reqHeaders,
      data: options.json,
      responseType: options.responseType,
    });

    const res: Response = {
      status: response.status,
      body: response.data,
      headers: response.headers as Record<string, string | string[]>,
    };

    return res;
  } catch (err) {
    throw err;
  }
};
