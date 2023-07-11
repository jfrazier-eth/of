import { Browsers } from "./common/index.js";
import { OF } from "./sites/index.js";
import { SessionContext } from "./sites/of/context.js";

async function main() {
  const proxy = process.env.HTTPS_PROXY;

  const xbc = process.env.XBC;
  const sess = process.env.OF_SESS;
  const authId = process.env.AUTH_ID;
  const apiKey = process.env.API_KEY;

  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  if (!sess) {
    throw new Error("OF_SESS env variable was not set");
  }
  if (!authId) {
    throw new Error("AUTH_ID env variable was not set");
  }
  if (!apiKey) {
    throw new Error("API_KEY env variable was not set");
  }

  // const fanslyUserId = process.env.FANSLY_USER_ID;
  // const fanslyAuth = process.env.FANSLY_AUTH;

  // if (!fanslyAuth) {
  //   throw new Error("FANSLY_AUTH env variable was not set");
  // }

  // if (!fanslyUserId) {
  //   throw new Error("FANSLY_USER_ID env variable was not set");
  // }

  // const fanslyUrl = "https://apiv3.fansly.com";
  // const fanslyContext = new Fansly.LoggedInContext(
  //   {
  //     userId: fanslyUserId,
  //     auth: fanslyAuth,
  //   },
  //   {
  //     baseUrl: fanslyUrl,
  //     browser: Browsers.brave,
  //     proxy,
  //   }
  // );

  // baseUrl: string | URL;
  // browser: Browsers.Browser;
  // proxy?: string | URL | null;

  const context = new SessionContext(
    {
      authId,
      xbc,
      sess,
      authUid: null,
    },
    {
      baseUrl: "https://onlyfans.com",
      browser: Browsers.brave,
      proxy: proxy ?? null,
    }
  );

  const fanId = "341475026";

  const messageHistory = await OF.Sdk.getMessages(context, fanId, {
    maxNumMessages: 10,
  });

  const payload = {
    messages: messageHistory,
    creator_id: authId,
    fan_id: fanId,
  };

  const response = await fetch(
    "https://of-2890.onrender.com/api/of/generateResponse",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(payload),
    }
  );
  const responseText = await response.text();
  console.log(responseText);
}

void main();
