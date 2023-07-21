import { OF } from "@/sites/index";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";

import { GetVaultItemsMessage } from "../../messages";
import { Handler } from "./types";

export const handleGetVaultItemsMessage: Handler<GetVaultItemsMessage> = async (msg, context) => {
  try {
    const userId = context.user?.userId;
    const ofAuth = context.ofAuth;
    if (!userId) {
      throw new Error("Missing user id");
    } else if (!ofAuth) {
      throw new Error("Missing auth id");
    }

    const ofContext = new SessionContext(
      {
        xbc: ofAuth.xbc,
        sess: ofAuth.sess,
        authId: ofAuth.authId,
        authUid: null,
      },
      {
        baseUrl: OF_BASE_URL,
      }
    );

    const response = await OF.Sdk.getVault(ofContext, {
      offset: msg.data.offset,
    });

    return {
      kind: "GET_VAULT_ITEMS",
      data: {
        items: response.items,
        hasNextPage: response.hasNextPage,
        offset: response.offset,
      },
    };
  } catch (err) {
    console.error(`Failed to load vault`, err);
    return {
      kind: "GET_VAULT_ITEMS",
      data: {
        error: "Failed to load vault, please try again later.",
      },
    };
  }
};
