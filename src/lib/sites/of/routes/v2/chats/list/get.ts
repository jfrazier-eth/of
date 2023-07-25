import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { SessionContext } from "@/sites/of/context";

import { GetMessageListOptions, GetMessageListResponseBody } from "./types";

const getHeaders = (userId: string) => {
  const headers = {
    Host: "onlyfans.com",
    "User-Id": userId,
    Referer: "https://onlyfans.com/my/chats/",
    Accept: "application/json, text/plain, */*",
  };

  return headers;
};
export const get = async (context: SessionContext, options: GetMessageListOptions) => {
  const searchParams = new URLSearchParams({
    limit: `${options.limit ?? 10}`,
    offset: `${options.offset ?? 0}`,
    skip_users: "all",
    order: options.order ?? "recent",
  });
  if (options.filter) {
    searchParams.append("filter", options.filter);
  }

  const url = context.getUrl("/api2/v2/chats", searchParams);
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userParams.authId),
      ...contextHeaders,
    };

    const response = await context.client.get<GetMessageListResponseBody>(url, {
      headers: reqHeaders,
    });

    if (response.status === 200) {
      return response.body;
    }

    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    if (err instanceof UnexpectedStatusCodeError) {
      throw err;
    }
    throw RequestError.create(err, url, context);
  }
};
