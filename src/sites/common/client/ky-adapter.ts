import ky from "ky";
import { RequestAdapter, Response } from "./types.js";

export const adapter: RequestAdapter<unknown, unknown> = async (request) => {
  const url = request.url.toString();

  try {
    const response = await ky(url.toString(), {
      method: request.method,
      throwHttpErrors: request.throwHttpErrors,
      responseType: request.responseType,
      cookieJar: request.cookieJar,
      headers: request.headers,
      json: request.json,
    });

    const res: Response<ResBody> = {
      status: response.status,
      body: response.body as ResBody,
      headers: response.headers,
    };

    return res;
  } catch (err) {
    throw err;
  }
};
