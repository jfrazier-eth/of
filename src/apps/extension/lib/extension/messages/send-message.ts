import { Result, err, ok } from "neverthrow";

import { Context } from "../../api/context";
import { MessageHandlers } from "../background/message-handlers";
import { Handler, HandlerError } from "../background/message-handlers/types";
import { isBackground } from "../utils/is-background";
import { Message } from "./index";
import { MessagesByKind, ResponsesByKind } from "./mappings";

export const sendMessage = async <T extends Message>(msg: T, context?: Context) => {
  if (!chrome.runtime) {
    throw new Error("No chrome runtime");
  }

  if (isBackground()) {
    type Msg = typeof msg;
    const handler = (MessageHandlers[msg.kind] as unknown) as Handler<Msg>;
    const response = await handler(
      (msg as unknown) as MessagesByKind[Msg["kind"]],
      context ?? Context.getInstance()
    );
    return response;
  } else {
    return await new Promise<Result<ResponsesByKind[T["kind"]], HandlerError>>((resolve) => {
      chrome.runtime.sendMessage(msg, (response) => {
        if (!response) {
          resolve(err(new Error(`BACKGROUND ERROR`)));
          return;
        }
        // we need to map these back to results or else they
        // won't have methods attached to them
        if (!response.isOk) {
          resolve(err(new Error(`BACKGROUND ERROR ${response.error}`)));
        } else {
          resolve(ok(response.value));
        }
      });
    });
  }
};
