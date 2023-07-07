import { SessionContext, UserContext, UserParams } from "../context.js";
import { Routes } from "../index.js";

export async function getSession(context: UserContext) {
  const initResponse = await Routes.V2.Init.get(context);
  const meResponse = await Routes.V2.Users.me.get(context, initResponse.sess);

  const session = new SessionContext(context.baseUrl, context.browser, {
    xbc: context.userParams.xbc,
    sess: initResponse.sess,
    authId: meResponse.id.toString(),
    authUid: null,
  });

  console.log(`Retrieved session for user ${meResponse.name}`);

  return session;
}
