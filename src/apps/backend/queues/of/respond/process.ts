import { Processor } from "bullmq";
import { ResultAsync, ok } from "neverthrow";

import { Site } from "@/backend/lib/accounts/types";
import { saveChatMostRecentMessageId } from "@/backend/lib/chats/of";
import { serverOFParamsHandler } from "@/backend/lib/of-params-handler";
import { generateResponse } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/chat/response/post";
import { GenerateChatRequestBody } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/chat/response/types";
import { parseError } from "@/sites/common/errors/parse-error";
import { OF } from "@/sites/index";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";

import { JobData, JobResult } from "./types";
import { Browsers } from "@/sites/common";

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
      browser: Browsers.brave
      // proxy: undefined  // TODO get proxy?
    },
    serverOFParamsHandler
  );
  const withUser = job.data.chat.withUser;
  const settings = job.data.settings;
  const messages = await OF.Sdk.getMessages(session, withUser.id, {
    maxNumMessages: 10,
  });
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
        const fromUserId = `${item.fromUser.id}`;
        const toUserId = fromUserId === settings.siteUserId ? withUser.id : settings.siteUserId;
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
  };

  const response = await ResultAsync.fromPromise(generateResponse(settings, data), (err) => {
    return new Error(`Failed to generate response ${err}`);
  });

  if (response.isErr()) {
    console.error(`Failed to generate response`, response.error)
    return response;
  }

  try {
    const message = response.value.message;
    const res = await OF.Routes.V2.Chats.User.Messages.Post.post(session, {
      toUserId: withUser.id,
      text: message,
      lockedText: false,
      mediaFiles: [],
      price: 0,
      previews: [],
      isCouplePeopleMedia: false,
      isForward: false,
    });
    const id = res.id.toString();
    const saveMessageRes = await saveChatMostRecentMessageId({
      siteUserId: session.userId,
      withUserId: withUser.id,
      messageId: id,
    });
    if (saveMessageRes.isErr()) {
      console.error(`Failed to save most recent message id`, saveMessageRes.error);
    }

    return ok({ id });
  } catch (e) {
    return parseError(e);
  }
};
