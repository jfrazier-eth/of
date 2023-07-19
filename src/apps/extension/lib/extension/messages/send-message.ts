import { Message } from "./index";
import { ResponsesByKind } from "./mappings";

export const sendMessage = async <T extends Message>(msg: T) => {
  if (!chrome.runtime) {
    throw new Error("No chrome runtime");
  }

  return new Promise<ResponsesByKind[T["kind"]]>((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response);
    });
  });
};
