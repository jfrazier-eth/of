import { UserContext } from "@/sites/of/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { getClient } from "@/common/http/index.js";
import { GetMeResponseBody } from "./types.js";

const path = "/api2/v2/users/me";

const headers = {
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: "https://onlyfans.com/",
};

export const get = async (context: UserContext, sess: string) => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
      Cookie: `sess=${sess}`,
    };
    const client = getClient();

    const response = await client.get(url.toString(), {
      headers: reqHeaders,
    });

    if (response.status === 200) {
      const body = await response.json<GetMeResponseBody>();

      return {
        id: body.id,
        name: body.name,
        username: body.username,
        email: body.email,
        wsAuthToken: body.wsAuthToken,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
