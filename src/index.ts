import { Browsers } from "./common/index.js";
import { Fansly, OF } from "./sites/index.js";
import { sleep } from "./utils/sleep.js";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const xbc = process.env.XBC;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }

  const OFContext = new OF.LoggedInContext(baseUrl, Browsers.brave, {
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

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      const status = await OF.Routes.V2.Init.get(OFContext);
      return;
    } catch (err) {
      console.log(`Attempt ${attempt} failed!`);
      console.error(err);
    }
    await sleep(3000);
  }
  // await OF.Routes.V2.Init.get(OFContext);
}

void main();
