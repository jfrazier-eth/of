import { err, ok } from "neverthrow";

import { Site } from "@/backend/lib/accounts/types";
import {
  GenerateChatRequestBody,
  GenerateChatResponseBody,
} from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/chat/response/types";
import { Browsers } from "@/sites/common";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";
import { getMessages } from "@/sites/of/sdk/get-messages";
import { parseError } from "@/utils/parse-error";

import { Context } from "./context";

const getPath = (userId: string, siteUserId: string) => {
  return `/api/users/${userId}/sites/${Site.OF}/users/${siteUserId}/chat/response`;
};
export async function generateResponse(
  context: Context,
  params: {
    withUser: {
      id: string;
    };
  }
) {
  try {
    const userId = context.user?.userId;
    const ofAuth = context.ofAuth;
    if (!userId) {
      throw new Error("Missing user id");
    } else if (!ofAuth) {
      throw new Error("Missing auth id");
    }
    const path = getPath(userId, ofAuth.authId);
    const url = context.getUrl(path);

    const ofContext = new SessionContext(
      {
        xbc: ofAuth.xbc,
        sess: ofAuth.sess,
        authId: ofAuth.authId,
        authUid: ofAuth.authUid,
        userAgent: ofAuth.userAgent,
      },
      {
        baseUrl: OF_BASE_URL,
        browser: Browsers.brave,
      },
      context.ofParams
    );

    const messagesResponse = await getMessages(ofContext, params.withUser.id, {
      maxNumMessages: 10,
    });

    if (messagesResponse.isErr()) {
      return err(messagesResponse.error);
    }

    const messages = messagesResponse.value;
    const body: GenerateChatRequestBody = {
      user: {
        id: userId,
        siteId: ofAuth.authId,
        site: Site.OF,
        name: "",
        handle: "",
      },
      chat: {
        withUser: {
          id: params.withUser.id,
          name: "",
          handle: "",
        },
        messages: messages.map((item) => {
          const fromUserId = `${item.fromUser.id}`;
          const toUserId = fromUserId === ofAuth.authId ? params.withUser.id : ofAuth.authId;
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

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...context.getHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const body = (await response.json()) as GenerateChatResponseBody;
      return ok(body);
    }
    return err(new Error(`Failed to generate response. Status code: ${response.status}`));
  } catch (error) {
    return parseError(error);
  }
}
