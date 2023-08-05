import { Processor } from "bullmq";
import { err, ok } from "neverthrow";

import { Site } from "@/backend/lib/accounts";
import { getChatMostRecentMessageId, saveChatMostRecentMessageId } from "@/backend/lib/chats/of";
import { getLogin } from "@/backend/lib/logins/of-logins/get-login";
import { serverOFParamsHandler } from "@/backend/lib/of-params-handler";
import { Browsers } from "@/sites/common";
import { OF } from "@/sites/index";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";
import { NotFoundError } from "@/utils/errors";

import { OFRespondQueue } from "..";
import { JobData, JobResult } from "./types";

export const processJob: Processor<JobData, JobResult> = async (job) => {
  const { settings } = job.data;
  const loginResult = await getLogin({
    site: Site.OF,
    siteUserId: settings.siteUserId,
    userId: settings.userId,
  });

  if (loginResult.isErr()) {
    console.warn(
      `Failed to get login for user ${settings.userId} Site ${Site.OF} SiteUserId ${settings.siteUserId}`,
      loginResult.error
    );
    return err(loginResult.error);
  }
  const login = loginResult.value;

  if (!login) {
    console.warn(
      `Login not found for user ${settings.userId} Site ${Site.OF} SiteUserId ${settings.siteUserId}`
    );
    return err(
      new NotFoundError(
        `Login not found for user ${settings.userId} Site ${Site.OF} SiteUserId ${settings.siteUserId}`
      )
    );
  }

  const session = new SessionContext(
    {
      xbc: login.params.xbc,
      authId: login.params.authId,
      sess: login.params.sess,
      authUid: login.params.authUid,
      userAgent: login.params.userAgent
    },
    {
      baseUrl: OF_BASE_URL,
      browser: Browsers.brave,
      // proxy: undefined  // TODO get proxy?
    },
    serverOFParamsHandler
  );

  const chats = OF.Sdk.getRecentChats(session);
  const chatsToProcess = [];
  for await (const result of chats) {
    if (result.isErr()) {
      console.error(`Failed to get chat`, result.error);
      continue;
    }

    const chat = result.value;
    const withUser = chat.withUser.id.toString();
    const lastMessageId = chat.lastMessage?.id.toString() ?? null;

    const mostRecentMessageRes = await getChatMostRecentMessageId({
      siteUserId: session.userId,
      withUserId: withUser,
    });
    if (mostRecentMessageRes.isErr()) {
      console.error(`Failed to get chat most recent message id`, mostRecentMessageRes.error);
      continue;
    }
    const mostRecentMessageId = mostRecentMessageRes.value;
    if (mostRecentMessageId === lastMessageId) {
      break;
    }
    if (!chat.canSendMessage) {
      console.log(`Cannot send message to user ${withUser} ${chat.canNotSendReason}`);
      if (lastMessageId) {
        const saveMessageRes = await saveChatMostRecentMessageId({
          siteUserId: session.userId,
          withUserId: withUser,
          messageId: lastMessageId,
        });
        if (saveMessageRes.isErr()) {
          console.error(
            `Failed to save message id ${lastMessageId} for user ${withUser}`,
            saveMessageRes.error
          );
        }
      }
      continue;
    }

    if (mostRecentMessageId && chat?.lastMessage?.fromUser.id.toString() === session.userId) {
      // update chats that the user has already responded to
      const saveMessageRes = await saveChatMostRecentMessageId({
        siteUserId: session.userId,
        withUserId: withUser,
        messageId: mostRecentMessageId,
      });
      if (saveMessageRes.isErr()) {
        console.error(`Failed to save chat most recent message id`, saveMessageRes.error);
        continue;
      }
    } else {
      chatsToProcess.push(chat);
    }
  }

  let numChatsTriggered = 0;

  // process chats from oldest to newest
  const chatUserIds = chatsToProcess.reverse().map((chat) => chat.withUser.id.toString());
  console.log(`Found ${chatUserIds.length} chats with new messages`);
  const chatsByUserId = Object.fromEntries(
    chatsToProcess.map((item) => [item.withUser.id.toString(), item])
  );

  for await (const userResult of OF.Sdk.getUserInfo(session, chatUserIds)) {
    if (userResult.isErr()) {
      console.error(`Failed to get user info`, userResult.error);
      continue;
    }

    const userInfo = userResult.value;
    const chat = chatsByUserId[userInfo.userId];
    const lastMessageId = chat?.lastMessage?.id?.toString() ?? null;
    if (!chat) {
      console.error(`Missing chat by user id for user ${userInfo.userId}`);
      continue;
    }

    const totalSpend = userInfo.total;
    if (totalSpend >= settings.settings.autoMessaging.spendingThreshold) {
      console.log(`User ${userInfo.username} is above the spending threshold.Skipping...`);
      if (lastMessageId) {
        const saveMessageRes = await saveChatMostRecentMessageId({
          siteUserId: session.userId,
          withUserId: userInfo.userId,
          messageId: lastMessageId,
        });
        if (saveMessageRes.isErr()) {
          console.error(
            `Failed to save most recent message id ${session.userId} with ${userInfo.userId} message ${lastMessageId} `,
            saveMessageRes.error
          );
        }
      }
    } else {
      console.log(
        `User ${userInfo.username} is below the spending threshold`,
        console.log(JSON.stringify(userInfo))
      );
      await OFRespondQueue.add({
        settings,
        login,
        chat: {
          withUser: {
            id: userInfo.userId,
            username: userInfo.username,
            name: userInfo.name,
          },
          lastMessageId,
        },
      });
      numChatsTriggered += 1;
    }
  }

  return ok({ numChatsTriggered });
};
