import { err, ok, Result } from "neverthrow";
import { MessageHandlers } from "../background/message-handlers";
import { Handler, HandlerError } from "../background/message-handlers/types";
import { isBackground } from "../utils/is-background";
import { Message } from "./index";
import { MessagesByKind, ResponsesByKind } from "./mappings";

export const sendMessage = async <T extends Message>(msg: T) => {
  if (!chrome.runtime) {
    throw new Error("No chrome runtime");
  }

  if (isBackground()) {
    const { context } = await import("../background/context");
    type Msg = typeof msg;
    const handler = (MessageHandlers[msg.kind] as unknown) as Handler<Msg>;
    const response = await handler((msg as unknown) as MessagesByKind[Msg["kind"]], context);
    return response;
  } else {
    return await new Promise<Result<ResponsesByKind[T["kind"]], HandlerError>>((resolve, reject) => {
      chrome.runtime.sendMessage(msg, (response) => {
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
