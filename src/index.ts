import { Routes, Browsers, Context } from "@/api/index";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const xbc = process.env.XBC;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  const authId = process.env.AUTH_ID;
  if (!authId) {
    throw new Error("AUTH_ID env variable was not set");
  }
  const sess = process.env.SESS;

  if (!sess) {
    throw new Error("SESS env variable was not set");
  }

  const authUid = process.env.AUTH_UID || null;

  const loggedInContext = new Context.LoggedInContext(baseUrl, Browsers.brave, {
    xbc,
    sess,
    authId,
    authUid,
  });

  // await Routes.Home.get(loggedInContext);
  await Routes.V2.Users.me.get(loggedInContext);
  await Routes.V2.Init.get(loggedInContext);
}

void main();
