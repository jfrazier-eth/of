import { SessionContext } from "@/sites/of/context.js";
import { getPath } from "./path.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { SentMessage } from "./types.js";

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

    if (response.statusCode === 200) {
      return response.body;
    }

    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
