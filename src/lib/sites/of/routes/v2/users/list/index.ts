
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

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

    if (response.isOk()) {
      return ok(response.value.body);
    }
    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};
