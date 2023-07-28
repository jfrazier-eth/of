import { Processor } from "bullmq";
import { err, ok } from "neverthrow";

import { Site } from "@/backend/lib/accounts/types";
import { getChatMostRecentMessageId, saveChatMostRecentMessageId } from "@/backend/lib/chats/of";
import { serverOFParamsHandler } from "@/backend/lib/of-params-handler";
import { UserMedia } from "@/backend/lib/user-media/types";
import { generateResponse } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/chat/response/post";
import { GenerateChatRequestBody } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/chat/response/types";
import { Browsers } from "@/sites/common";
import { OF } from "@/sites/index";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";
import { flipCoin, selectRandom } from "@/utils/random";

import { JobData, JobResult } from "./types";

export const processJob: Processor<JobData, JobResult> = async (job) => {
  const session = new SessionContext(
    {
      xbc: job.data.login.params.xbc,
      authId: job.data.login.params.authId,
      sess: job.data.login.params.sess,
      authUid: null,
    },
    {
      baseUrl: OF_BASE_URL,
      browser: Browsers.brave,
      // proxy: undefined  // TODO get proxy?
    },
    serverOFParamsHandler
  );
  const withUser = job.data.chat.withUser;
  const settings = job.data.settings;
  const primaryPPV = job.data.settings.settings.autoMessaging.primaryPPV;
  const secondaryPPV = job.data.settings.settings.autoMessaging.secondaryPPV;

  const messagesResponse = await OF.Sdk.getMessages(session, withUser.id, {
    maxNumMessages: 10,
  });

  if (messagesResponse.isErr()) {
    console.error(`Failed to get messages for user`, messagesResponse.error);
    return err(messagesResponse.error) as JobResult;
  }

  const messages = messagesResponse.value;

  let lastMessageId = typeof messages[0]?.id === "number" ? messages[0].id.toString() : null;

  if (job.data.chat.lastMessageId !== lastMessageId) {
    return ok({
      sent: false,
      reason: "Skipped. Most recent message is not the expected message.",
    }) as JobResult;
  }

  const ppvs = [primaryPPV, secondaryPPV].filter((item) => item.media) as {
    media: UserMedia;
    price: number;
  }[];
  const isPPV = ppvs.length > 0 && messages.length > 3 && flipCoin();
  const ppv = isPPV ? selectRandom(ppvs) : null;
  const data: GenerateChatRequestBody = {
    user: {
      id: settings.userId,
      siteId: settings.siteUserId,
      site: Site.OF,
      name: "",
      handle: "",
    },
    chat: {
      withUser: {
        id: withUser.id,
        name: withUser.name,
        handle: withUser.username,
      },
      messages: messages.map((item) => {
        const fromUserId = item.fromUser.id.toString();
        const toUserId = fromUserId === withUser.id ? settings.siteUserId : withUser.id;
        const id = `${item.id}`;
        return {
          id,
          createdAt: item.createdAt,
          fromUser: {
            id: fromUserId,
          },
          toUser: {
            id: toUserId,
          },
          text: item.text,
          media: item.media.map((item) => {
            if (item.canView) {
              return {
                id: `${item.id}`,
                type: item.type,
                isViewable: true,
                src: item.src ?? "",
                preview: item.preview ?? "",
              };
            }
            return {
              id: `${item.id}`,
              type: item.type,
              isViewable: false,
            };
          }),
          isOpened: item.isOpened,
          isLiked: item.isLiked,
          isFree: item.isFree,
          price: item.price,
          canPurchase: item.canPurchase,
          isTip: item.isTip,
          tipAmount: item.tipAmount,
        };
      }),
    },
    isPPV: ppv !== null,
  };

  const mostRecentMessageResponse = await getChatMostRecentMessageId({
    siteUserId: session.userId,
    withUserId: withUser.id,
  });

  if (mostRecentMessageResponse.isErr()) {
    console.error(`Failed to get most recent message id`, mostRecentMessageResponse.error);
    return err(mostRecentMessageResponse.error) as JobResult;
  }

  const currentMesssageHasBeenProcessed =
    mostRecentMessageResponse.value === messages[0].id.toString();
  const mostRecentMessageWasSentByUser = messages[0].fromUser.id.toString() === settings.siteUserId;
  if (currentMesssageHasBeenProcessed) {
    return ok({
      sent: false,
      reason: "Skipped. Most recent message has already been processed.",
    }) as JobResult;
  } else if (mostRecentMessageWasSentByUser) {
    return ok({
      sent: false,
      reason: "Skipped. Most recent message was sent by user.",
    }) as JobResult;
  }

  const response = await generateResponse(settings, data);
  if (response.isErr()) {
    console.error(`Failed to generate response`, response.error);
    return err(response.error) as JobResult;
  }

  console.log(`Sending message to ${withUser.username}...`);
  try {
    const message = response.value.message;
    const messageData =
      ppv === null
        ? {
          toUserId: withUser.id,
          text: message,
          lockedText: false,
          mediaFiles: [],
          price: 0,
          previews: [],
          isCouplePeopleMedia: false,
          isForward: false,
        }
        : {
          toUserId: withUser.id,
          text: message,
          lockedText: false,
          mediaFiles: [parseInt(ppv.media.siteMediaId, 10)],
          price: ppv.price,
          previews: [],
          isCouplePeopleMedia: false,
          isForward: false,
        };
    const res = await OF.Routes.V2.Chats.User.Messages.Post.post(session, messageData);
    if (res.isErr()) {
      console.error(`Failed to send message`, res.error);
      return err(res.error) as JobResult;
    }
    const id = res.value.id.toString();
    const saveMessageRes = await saveChatMostRecentMessageId({
      siteUserId: session.userId,
      withUserId: withUser.id,
      messageId: id,
    });
    if (saveMessageRes.isErr()) {
      console.error(`Failed to save most recent message id`, saveMessageRes.error);
      // don't return here since the message was sent successfully
    }

    return ok({ id, sent: true }) as JobResult;
  } catch (e) {
    const error = parseError(e);
    console.log(`Failed to send message to ${withUser.username}`, error.error);
    return error as JobResult;
  }
};
