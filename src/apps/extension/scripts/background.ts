import { saveAuth } from "../lib/auth/index";
import { Auth } from "../lib/auth/types";
import { context } from "../lib/extension/background/context";
import { registerMessageHandler } from "../lib/extension/background/message-handlers/index";
import { registerQueues } from "../lib/extension/background/queues";
import { sendMessage } from "../lib/extension/messages";

registerMessageHandler(context);
registerQueues(context);

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

let cachedRevision: string | null = null;
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    const revision = url.searchParams.get("rev");

    if (revision && revision !== cachedRevision) {
      cachedRevision = revision;

      sendMessage({
        kind: "UPDATE_OF_REVISION",
        data: {
          revision,
        },
      })
        .then((res) => {
          if (res.data.success) {
            console.log(`Updated revision to ${res.data.revision}`);
          } else {
            console.error(`Failed to update revision`, res.data.message);
          }
        })
        .catch((err) => console.error(err));
    }
  },
  {
    urls: ["https://static.onlyfans.com/*"],
  }
);
