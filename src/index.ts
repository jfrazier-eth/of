import { serverOFParamsHandler } from "@/backend/lib/of-params-handler";
import { Browsers } from "@/sites/common";
import { setAdapter } from "@/sites/common/client";
import { adapter } from "@/sites/common/client/got-adapter";
import { SessionContext } from "@/sites/of";

import { OF } from "./lib/sites";

async function main() {
  const proxy = process.env.HTTPS_PROXY;

  setAdapter(adapter);
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
      userAgent: Browsers.brave.headers.userAgent,
    },
    {
      baseUrl: "https://onlyfans.com",
      browser: Browsers.brave,
      proxy: proxy ?? null,
    },
    serverOFParamsHandler
  );

  const res = await OF.Routes.V2.Users.me.get(context);
  console.log(res);
  // const fanId = "341475026";
  // const fanHandle = "blkmichcutie";
  // const stats = await OF.Sdk.getFanStats(context, fanHandle);
  // const messages = await getMessages(context, fanId, {
  //   maxNumMessages: 10,
  // });
  //const newFans = await OF.Sdk.getNewFans(context, { startDate: "2023-06-14 00:00:00", endDate: "2023-07-14 16:29:27" });
  //const userName = await OF.Sdk.getFanHandle(context, fanId);
  // console.log(transformMessages(authId, messages));
}

void main();
