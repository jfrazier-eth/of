
import { SessionContext } from "@/sites/of/context";
import { OFApiError } from "@/sites/of/errors";
import { parseError } from "@/utils/parse-error";
import { err, ok, Result } from "neverthrow";

import { GetInitResponseBody } from "./types";

const path = "/api2/v2/init";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Referer: "https://onlyfans.com/",
  Accept: "application/json, text/plain, */*",
};

export const get = async (context: SessionContext): Promise<Result<GetInitResponseBody, OFApiError>> => {
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

    if (response.isOk()) {
      return ok(response.value.body);
    }

    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};
