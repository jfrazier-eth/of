import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { SessionContext } from "@/sites/of/context";

import { GetInitResponseBody } from "./types";

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

    if (response.status === 200) {
      return;
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    if (err instanceof UnexpectedStatusCodeError) {
      throw err;
    }
    throw RequestError.create(err, url, context);
  }
};
