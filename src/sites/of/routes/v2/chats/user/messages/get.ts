import { RequestError } from "@/common/errors/request-errors.js";
import { SessionContext } from "@/sites/of/context.js";

const getPath = (userIdOfChat: string) => {
  return `/api2/v2/chats/${userIdOfChat}/messages`;
};

const getHeaders = (userId: string, userIdOfChat: string) => {
  const headers = {
    Host: "onlyfans.com",
    "User-Id": userId,
    Referer: `https://onlyfans.com/my/chats/chat/${userIdOfChat}/`,
  };

  return headers;
};

export interface GetChatOptions {
  otherUserId: string;
  limit?: number;
  order?: "asc" | "desc";
}

export interface GetChatResponseBody {}

export const get = async (context: SessionContext, options: GetChatOptions) => {
  const path = getPath(options.otherUserId);
  const searchParams = new URLSearchParams({
    limit: `${options.limit ?? 10}`,
    order: options.order ?? "desc",
    skip_users: "all",
  });

  const url = context.getUrl(path, searchParams);
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userParams.authId, options.otherUserId),
      ...contextHeaders,
    };

    const response = await context.client.get<GetChatResponseBody>(url, {
      headers: reqHeaders,
    });

    console.log(response.statusCode);
    console.log(response.body);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
