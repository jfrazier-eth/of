import { redisGet, redisSet } from "@/backend/db/redis";

import { Site } from "../../accounts/types";

const getKey = (params: { siteUserId: string; withUserId: string }) => {
  return `user:${params.siteUserId}:site:${Site.OF}:chats:${params.withUserId}:messages:most-recent`;
};

export const getChatMostRecentMessageId = async ({
  siteUserId,
  withUserId,
}: {
  siteUserId: string;
  withUserId: string;
}) => {
  return await redisGet(getKey({ siteUserId, withUserId }));
};

export const saveChatMostRecentMessageId = ({
  siteUserId,
  withUserId,
  messageId,
}: {
  siteUserId: string;
  withUserId: string;
  messageId: string;
}) => {
  return redisSet(getKey({ siteUserId, withUserId }), messageId);
};
