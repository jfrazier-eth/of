import { SessionContext } from "@/sites/of/context";
import { getPath } from "./path";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors";
import { SentMessage } from "./types";

const getHeaders = (userId: string, toUserId: string) => {
  const headers = {
    Host: "onlyfans.com",
    "User-Id": userId,
    Origin: "https://onlyfans.com",
    Referer: `https://onlyfans.com/my/chats/chat/${toUserId}/`,
  };
  return headers;
};

export interface PostMessageBody {
  text: string;
  lockedText?: boolean;
  mediaFiles?: unknown[];
  price?: number;
  previews?: unknown[];
  isCouplePeopleMedia?: boolean;
  isForward?: boolean;
}

export interface PostMessagesOptions extends PostMessageBody {
  toUserId: string;
}

export type PostMessageResponseBody = SentMessage;

export const post = async (
  context: SessionContext,
  options: PostMessagesOptions
) => {
  const path = getPath(options.toUserId);
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userParams.authId, options.toUserId),
      ...contextHeaders,
    };

    const body: PostMessageBody = {
      text: options.text,
      lockedText: options.lockedText ?? false,
      mediaFiles: options.mediaFiles ?? [],
      price: options.price ?? 0,
      previews: options.previews ?? [],
      isCouplePeopleMedia: options.isCouplePeopleMedia ?? false,
      isForward: options.isForward ?? false,
    };

    const response = await context.client.post<PostMessageResponseBody>(url, {
      headers: reqHeaders,
      json: body,
    });

    if (response.status === 200) {
      return response.body;
    }

    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
