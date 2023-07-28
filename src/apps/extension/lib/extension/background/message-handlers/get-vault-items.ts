import { OF } from "@/sites/index";
import { OF_BASE_URL } from "@/sites/of";
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { GetVaultItemsMessage } from "../../messages";
import { Handler } from "./types";

export const handleGetVaultItemsMessage: Handler<GetVaultItemsMessage> = async (msg, context) => {
  try {
    await context.isReady;
    const userId = context.user?.userId;
    const ofAuth = context.ofAuth;
    if (!userId) {
      return err(new Error("Missing user id"));
    } else if (!ofAuth) {
      return err(new Error("Missing auth id"));
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
      },
      context.ofParams
    );

    const response = await OF.Sdk.getVault(ofContext, {
      offset: msg.data.offset,
    });
    if (response.isErr()) {
      return err(response.error)
    }

    return ok({
      kind: "GET_VAULT_ITEMS",
      data: {
        items: response.value.items,
        hasNextPage: response.value.hasNextPage,
        offset: response.value.offset,
      },
    });
  } catch (err) {
    return parseError(err);
  }
};
