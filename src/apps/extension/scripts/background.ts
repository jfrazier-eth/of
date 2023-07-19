import { saveAuth } from "../lib/auth/index.js";
import { Auth } from "../lib/auth/types.js";
import { context } from "../lib/extension/background/context.js";
import { registerMessageHandler } from "../lib/extension/background/message-handlers/index.js";

registerMessageHandler(context);

/**
 * attempt to update auth when a request is made
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const requestHeaders = details.requestHeaders ?? [];
    const url = details.url;

    for (const requestHeader of requestHeaders) {
      if (requestHeader.name === "x-bc") {
        const xbc = requestHeader.value;
        if (xbc) {
          chrome.cookies.getAll({ url }, function (cookies) {
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

            const auth: Auth = {
              xbc,
              authId,
              sess,
            };

            saveAuth(auth)
              .then(() => {
                console.log("Saved auth");
              })
              .catch((err) => {
                console.log("Failed to save auth", err);
              });
          });
        }
      }
    }
  },
  { urls: ["https://onlyfans.com/*"] },
  ["requestHeaders"]
);
