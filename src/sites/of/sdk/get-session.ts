import { sleep } from "@/utils/sleep.js";
import { SessionContext, UserContext } from "../context.js";
import { Routes } from "../index.js";

export async function getSession(context: UserContext) {
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
