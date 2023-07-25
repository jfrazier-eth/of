import { err, ok } from "neverthrow";

import { Context } from "@/extension/lib/api/context";
import { OF_BASE_URL, SessionContext } from "@/sites/of";

import { sendMessage } from "../../../messages";
import { getUserInfo, messagingQueue, sendOFMessage } from "./auto-messaging";
import { getChatsWithNewMessages } from "./new-chats";
import { saveChatMostRecentMessageId } from "./new-chats/storage";
import { init as initSettings } from "./settings";

export const worker = (context: Context, options: { interval: number }) => {
  if (!context.ofAuth) {
    return err(new Error("No auth context found"));
  }

  const session = new SessionContext(
    {
      xbc: context.ofAuth.xbc,
      authId: context.ofAuth.authId,
      sess: context.ofAuth.sess,
      authUid: null,
    },
    {
      baseUrl: OF_BASE_URL,
    },
    context.ofParams
  );

  const { stop: stopSettings } = initSettings({
    interval: options.interval,
    callbacks: [
      async (context, settings) => {
        if (
          !settings.settings.autoMessaging.enabled ||
          settings.settings.autoMessaging.spendingThreshold === 0
        ) {
          console.log(`Auto messaging is not enabled`);
          return;
        }
        // get chats that have not yet been processed
        const newChatsResponse = await getChatsWithNewMessages(session);

        if (newChatsResponse.isErr()) {
          console.error(`Failed to get new chats`, newChatsResponse.error);
          return;
        }

        // get the total amount the user has spent
        const chatUserIds = newChatsResponse.value.chats.map((chat) => chat.withUser.id.toString());
        console.log(`Found ${chatUserIds.length} chats with new messages`);
        const chatsByUserId = Object.fromEntries(
          newChatsResponse.value.chats.map((item) => [item.withUser.id.toString(), item])
        );
        for await (const item of getUserInfo(session, chatUserIds)) {
          if (item.isErr()) {
            console.error(`Failed to get user info`, item.error);
            continue;
          }

          const userInfo = item.value;
          const chat = chatsByUserId[userInfo.userId];
          if (!chat) {
            console.error(`Missing chat by user id for user ${userInfo.userId}`);
            continue;
          }

          const totalSpend = userInfo.total;
          if (totalSpend >= settings.settings.autoMessaging.spendingThreshold) {
            console.log(`User ${userInfo.username} is above the spending threshold. Skipping...`);
            const res = await saveChatMostRecentMessageId(
              session.userId,
              userInfo.userId,
              chat.lastMessage.id.toString()
            );
            if (res.isErr()) {
              console.error(
                `Failed to save most recent message id ${session.userId} with ${userInfo.userId} message ${chat.lastMessage.id}`
              );
            }
          } else {
            console.log(
              `User ${userInfo.username} is below the spending threshold. Sending message...`
            );
            // user is below the spending threshold
            messagingQueue
              .add(async () => {
                console.log(`Generating response to user ${userInfo.username}`);
                const response = await sendMessage({
                  kind: "GENERATE_RESPONSE",
                  data: {
                    chat: {
                      withUser: {
                        id: userInfo.userId,
                      },
                    },
                  },
                });
                console.log(`Generated response. Sending message...`);

                const message = response.data.message;
                const res = await sendOFMessage(session, {
                  toUserId: userInfo.userId,
                  text: message,
                });

                if (res.isErr()) {
                  console.error(`Failed to send message`, res.error);
                } else {
                  console.log(`Sent message ${res.value.id} to user ${userInfo.username}`);
                  const saveMessageIdRes = await saveChatMostRecentMessageId(
                    session.userId,
                    userInfo.userId,
                    res.value.id
                  );
                  if (saveMessageIdRes.isErr()) {
                    console.error(
                      `Failed to save most recent message id ${session.userId} with ${userInfo.userId} message ${res.value.id} `
                    );
                  }
                }
              })
              .catch((err) => {
                console.error(`Unexpected error while sending message`, err);
              });
          }
        }
        console.log(`Waiting for all messages to send...`);
        // wait for all messages to be sent
        await messagingQueue.onIdle();
        console.log(`All messages sent!`);
      },
    ],
    context,
  });

  return ok({
    stop: () => {
      stopSettings();
    },
  });
};
