import { SessionContext } from "@/sites/of/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors.js";
import { GetMeResponseBody } from "./types.js";

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

    if (response.statusCode === 200) {
      return {
        id: response.body.id,
        name: response.body.name,
        username: response.body.username,
        email: response.body.email,
        wsAuthToken: response.body.wsAuthToken,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
