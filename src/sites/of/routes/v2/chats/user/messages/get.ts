import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors.js";
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
  startAfterMessageId?: string | null;
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
    limit: `10`, // has to be 10
    order: options.order ?? "desc",
    skip_users: "all",
  });
  if (options.startAfterMessageId) {
    searchParams.append("id", options.startAfterMessageId);
  }

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

    if (response.status === 200) {
      return response.body;
    }

    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
