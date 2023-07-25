import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { SessionContext } from "@/sites/of/context";

import { GetUsersResponseBody } from "./types";

const path = "/api2/v2/users/list";
const getHeaders = (userId: string) => ({
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: "https://onlyfans.com/my/chats/",
  "User-id": userId,
});

export const getUsers = async (context: SessionContext, userIds: string[]) => {
  const searchParams = new URLSearchParams();
  for (const userId of userIds) {
    searchParams.append("cl[]", userId);
  }
  const url = context.getUrl(path, searchParams);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userId),
      ...contextHeaders,
    };
    const response = await context.client.get<GetUsersResponseBody>(url, {
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
