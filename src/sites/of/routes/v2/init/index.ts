import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { GetInitResponseBody } from "./types.js";
import { SessionContext } from "@/sites/of/context.js";

const path = "/api2/v2/init";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Referer: "https://onlyfans.com/",
  Accept: "application/json, text/plain, */*",
};

export const get = async (context: SessionContext): Promise<void> => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...contextHeaders,
      ...headers,
    };

    const response = await context.client.get<GetInitResponseBody>(url, {
      headers: reqHeaders,
    });

    if (response.statusCode === 200) {
      return;
    }
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    console.error(err);
    throw RequestError.create(err, url, context);
  }
};
