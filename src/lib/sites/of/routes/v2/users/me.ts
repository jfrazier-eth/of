import { err, ok } from "neverthrow";

import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";

import { GetMeResponseBody } from "./types";

const path = "/api2/v2/users/me";

const headers = {
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: "https://onlyfans.com/",
};

export const get = async (context: SessionContext) => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };
    const response = await context.client.get<GetMeResponseBody>(url, {
      headers: reqHeaders,
    });

    if (response.isOk()) {
      return ok({
        id: response.value.body.id,
        name: response.value.body.name,
        username: response.value.body.username,
        email: response.value.body.email,
        wsAuthToken: response.value.body.wsAuthToken,
      });
    }

    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};
