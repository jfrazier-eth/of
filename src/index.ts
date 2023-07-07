import { Browsers } from "./common/index.js";
import { Fansly, OF } from "./sites/index.js";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const xbc = process.env.XBC;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }

  const ofContext = new OF.UserContext(baseUrl, Browsers.brave, {
    xbc,
  });

  const fanslyUserId = process.env.FANSLY_USER_ID;
  const fanslyAuth = process.env.FANSLY_AUTH;

  if (!fanslyAuth) {
    throw new Error("FANSLY_AUTH env variable was not set");
  }

  if (!fanslyUserId) {
    throw new Error("FANSLY_USER_ID env variable was not set");
  }

  const fanslyUrl = "https://apiv3.fansly.com";
  const fanslyContext = new Fansly.LoggedInContext(fanslyUrl, Browsers.brave, {
    userId: fanslyUserId,
    auth: fanslyAuth,
  });

  const session = await OF.Sdk.getSession(ofContext);
}

void main();
