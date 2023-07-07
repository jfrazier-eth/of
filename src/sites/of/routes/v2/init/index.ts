import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { getClient } from "@/common/http/index.js";
import { GetInitResponseBody, InitResponse } from "./types.js";
import { UserContext } from "@/sites/of/context.js";
import { extractCookie } from "@/sites/of/utils/extract-cookie.js";

const path = "/api2/v2/init";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Referer: "https://onlyfans.com/",
  Accept: "application/json, text/plain, */*",
};

export const get = async (context: UserContext): Promise<InitResponse> => {
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
    });

    if (response.status === 200) {
      const body = await response.json<GetInitResponseBody>();
      const cookies = response.headers.get("set-cookie") ?? "";
      const sess = extractCookie("sess", cookies);
      if (!sess) {
        throw new Error("Failed to get sess cookie");
      }
      return {
        sess: sess,
        csrf: body.csrf,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
