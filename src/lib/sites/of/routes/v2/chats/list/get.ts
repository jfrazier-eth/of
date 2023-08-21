import { Result, err, ok } from "neverthrow";

import { ApiError } from "@/sites/common/errors";
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";

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
export const get = async (
  context: SessionContext,
  options: GetMessageListOptions
): Promise<Result<GetMessageListResponseBody, ApiError>> => {
  try {
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

    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userParams.authId),
      ...contextHeaders,
    };

    const response = await context.client.get<GetMessageListResponseBody>(
      url,
      {
        headers: reqHeaders,
      },
      200
    );

    if (response.isOk()) {
      return ok(response.value.body);
    }

    console.error(response.error);
    return err(response.error);
  } catch (e) {
    console.error(e);
    return parseError(e);
  }
};
