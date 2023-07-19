import { ResponsesByKind } from "./mappings";
import { Message } from "./messages";

type SendResponse<T extends Message> = (response: ResponsesByKind[T["kind"]]) => void;

export const onMessage = <T extends Message>(
  listener: (message: T, sender: chrome.runtime.MessageSender, sendResponse: SendResponse<T>) => Promise<void>
) => {
  chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
    listener(msg as T, sender, sendRes as SendResponse<T>)?.catch((err) => {
      console.error(err);
    });

    return true; // Required to indicate that the listener will respond asynchronously
  });
};
