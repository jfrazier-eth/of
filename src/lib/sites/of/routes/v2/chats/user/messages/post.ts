
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { getPath } from "./path";
import { SentMessage } from "./types";

const getHeaders = (userId: string, toUserId: string) => {
  const headers = {
    Host: "onlyfans.com",
    "User-Id": userId,
    "Content-Type": "application/json",
    Origin: "https://onlyfans.com",
    Referer: `https://onlyfans.com/my/chats/chat/${toUserId}/`,
    Accept: "application/json, text/plain, */*",
  };
  return headers;
};

export interface PostMessageBody {
  text: string;
  lockedText?: boolean;
  mediaFiles?: number[];
  price?: number;
  previews?: unknown[];
  isCouplePeopleMedia?: boolean;
  isForward?: boolean;
}

export interface PostMessagesOptions extends PostMessageBody {
  toUserId: string;
}

export type PostMessageResponseBody = SentMessage;

export const post = async (context: SessionContext, options: PostMessagesOptions) => {
  try {
    const path = getPath(options.toUserId);
    const url = context.getUrl(path);


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

    if (response.isOk()) {
      return ok(response.value.body);
    }

    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};
