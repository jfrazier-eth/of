import { sleep } from "@/utils/sleep.js";
import { SessionContext, UserContext, UserParams } from "../context.js";
import { Routes } from "../index.js";

export async function getSession(context: UserContext) {
  while (true) {
    try {
      await Routes.V2.Init.get(context);
      const meResponse = await Routes.V2.Users.me.get(context);
      const session = new SessionContext(context.baseUrl, context.browser, {
        xbc: context.userParams.xbc,
        authId: meResponse.id.toString(),
        authUid: null,
      });
      console.log(`Retrieved session for user ${meResponse.name}`);

      return session;
    } catch (err) {
      console.error("Failed to get a valid session. Trying again.", err);
      await sleep(3456);
    }
  }
}
