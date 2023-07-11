import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { SessionContext } from "@/sites/of/context.js";
import { ReceivedMessage } from "./types.js";

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

export interface GetMessagesOptions {
  otherUserId: string;
  // message id to start after
  id?: string;
  limit?: number;
  order?: "asc" | "desc";
}

export interface GetMessagesResponseBody {
  list: ReceivedMessage[];
  hasMore: boolean;
}

export const get = async (
  context: SessionContext,
  options: GetMessagesOptions
) => {
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

    const response = await context.client.get<GetMessagesResponseBody>(url, {
      headers: reqHeaders,
    });

    if (response.statusCode === 200) {
      return response.body;
    }

    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};