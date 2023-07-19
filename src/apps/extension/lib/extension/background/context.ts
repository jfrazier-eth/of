import { Context } from "../../api/context";
import { API_BASE_URL } from "../../constants";
import { sendMessage } from "../messages";
import { handleActiveUserInfoMessage } from "./message-handlers/user-info";

export let context = new Context(API_BASE_URL);

export const contextLoaded = new Promise<Context>((resolve, reject) => {
  if (chrome.extension.getBackgroundPage() === window) {
    handleActiveUserInfoMessage({ kind: "ACTIVE_USER_INFO" }, context)
      .then((response) => {
        if (response.data.isLoggedIn) {
          context.user = {
            userId: response.data.userId,
            apiKey: response.data.apiKey,
          };
        }
        console.warn("No active user");
        resolve(context);
        return;
      })
      .catch((err) => {
        console.error(err);
        resolve(context);
      });
  } else {
    sendMessage({ kind: "ACTIVE_USER_INFO" })
      .then((response) => {
        if (response.data.isLoggedIn) {
          context.user = {
            userId: response.data.userId,
            apiKey: response.data.apiKey,
          };
        }
        console.warn("No active user");
        resolve(context);
        return;
      })
      .catch((err) => {
        console.error(err);
        resolve(context);
      });
  }
});
