import { Browsers } from "./common/index.js";
import { Fansly, OF } from "./sites/index.js";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const proxy = process.env.HTTPS_PROXY;

  const xbc = process.env.XBC;
  const sess = process.env.OF_SESS;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }

  if (!sess) {
    throw new Error("OF_SESS env variable was not set");
  }

  const ofContext = new OF.UserContext(
    {
      xbc,
      sess: sess,
    },
    {
      baseUrl,
      browser: Browsers.brave,
      proxy,
    }
  );

  const fanslyUserId = process.env.FANSLY_USER_ID;
  const fanslyAuth = process.env.FANSLY_AUTH;

  if (!fanslyAuth) {
    throw new Error("FANSLY_AUTH env variable was not set");
  }

  if (!fanslyUserId) {
    throw new Error("FANSLY_USER_ID env variable was not set");
  }

  const fanslyUrl = "https://apiv3.fansly.com";
  const fanslyContext = new Fansly.LoggedInContext(
    {
      userId: fanslyUserId,
      auth: fanslyAuth,
    },
    {
      baseUrl: fanslyUrl,
      browser: Browsers.brave,
      proxy,
    }
  );

  const session = await OF.Sdk.getSession(ofContext);

  const chats = await OF.Routes.V2.Chats.User.get(session, {
    otherUserId: "48426405",
  });
}

void main();
