import { Browsers } from "../../../common/index.js";
import { sleep } from "@/utils/sleep.js";
import { SessionContext, UserContext } from "../context.js";

const baseUrl = "https://onlyfans.com";

//Why do we need this?
// const proxy = process.env.HTTPS_PROXY;



async function createSession(context: UserContext) {
  while (true) {
    try {
      //Why do we ever have to run this?
      //await Routes.V2.Init.get(context);
      //No need to call me too, because authId is nothing but user_id and doesn't change at all.
      //const meResponse = await Routes.V2.Users.me.get(context);
      const session = new SessionContext(
        {
          xbc: context.userParams.xbc,
          sess: context.userParams.sess,
          authId: context.userParams.authId,
          authUid: null,
        },
        context.options
      );
      console.log(`Retrieved session for user`);

      return session;
    } catch (err) {
      console.error("Failed to get a valid session. Trying again.", err);
      await sleep(3456);
    }
  }
}


export async function getSession(xbc: string, sess: string, authId: string) {
  const context = new UserContext(
    {
      xbc,
      sess,
      authId,
    },
    {
      baseUrl,
      browser: Browsers.brave,
    }
  );
  return await createSession(context);
}
