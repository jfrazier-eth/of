import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { getClient } from "@/common/http/index.js";
import { LoggedInContext } from "@/sites/of/index.js";

const path = "/api2/v2/init";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Referer: "https://onlyfans.com/",
  Accept: "application/json, text/plain, */*",
};

export const get = async (context: LoggedInContext) => {
  const url = context.getUrl(path);

  try {
    const client = getClient();
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };

    const response = await client.get(url, {
      headers: reqHeaders,
      parseJson: JSON.parse,
      throwHttpErrors: false,
    });

    if (response.status === 200) {
      const body = await response.json();
      console.log(body);
      console.log(response.headers);
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
