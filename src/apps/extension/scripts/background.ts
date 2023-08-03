import { saveAuth } from "../lib/auth/index";
import { Auth } from "../lib/auth/types";
import { Context } from "../lib/api/context";
import { registerMessageHandler } from "../lib/extension/background/message-handlers/index";


const context = Context.getInstance();
registerMessageHandler(context);

/**
 * attempt to update auth when a request is made
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const requestHeaders = details.requestHeaders ?? [];
    const url = details.url;

    for (const requestHeader of requestHeaders) {
      if (requestHeader.name === "x-bc") {
        const xbc = requestHeader.value;
        if (xbc) {
          chrome.cookies.getAll({ url }, function(cookies) {
            let authId = "";
            let sess = "";
            for (const cookie of cookies) {
              switch (cookie.name) {
                case "auth_id": {
                  authId = cookie.value;
                  break;
                }
                case "sess": {
                  sess = cookie.value;
                  break;
                }
              }
            }

            if (!xbc && !sess && !authId) {
              return;
            }

            const auth: Auth = {
              xbc,
              authId,
              sess,
            };
            context.isReady
              .then(() => {
                return saveAuth(auth, context);
              })
              .catch((err) => {
                console.error(`Failed to save auth for ${xbc}`, err);
              });
          });
        }
        return;
      }
    }
  },
  { urls: ["https://onlyfans.com/*"] },
  ["requestHeaders"]
);
