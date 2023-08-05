import { Context } from "../lib/api/context";
import { saveAuth } from "../lib/auth/index";
import { Auth } from "../lib/auth/types";
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
    let xbc = '';
    let authId = '';
    let sess = '';
    let userAgent = navigator.userAgent;
    let authUid: string | null = null;
    for (const requestHeader of requestHeaders) {
      if (requestHeader.name === "x-bc") {
        xbc = requestHeader.value ?? '';
      } else if (requestHeader.name === 'user-id') {
        authId = requestHeader.value ?? '';
      }
    }

    if (xbc && authId && userAgent) {
      chrome.cookies.getAll({ url }, function(cookies) {
        for (const cookie of cookies) {
          if (cookie.name === 'sess') {
            sess = cookie.value;
          } else if (cookie.name === 'auth_uid') {
            authUid = cookie.value;
          }
        }

        if (xbc && sess && authId && userAgent) {
          const auth: Auth = {
            xbc,
            authId,
            sess,
            userAgent,
            authUid
          };
          context.isReady
            .then(() => {
              return saveAuth(auth, context);
            })
            .catch((err) => {
              console.error(`Failed to save auth for ${xbc}`, err);
            });
        }
      });
    }
  },
  { urls: ["https://onlyfans.com/*"] },
  ["requestHeaders"]
);
