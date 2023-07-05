import { Browsers } from "./common/index.js";
import { Fansly, OF } from "./sites/index.js";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const xbc = process.env.XBC;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  // const authId = process.env.AUTH_ID;
  // if (!authId) {
  //   throw new Error("AUTH_ID env variable was not set");
  // }
  // const sess = process.env.SESS;

  // if (!sess) {
  //   throw new Error("SESS env variable was not set");
  // }

  const authUid = process.env.AUTH_UID || null;

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

  // const res = await Fansly.Routes.V1.Account.get(fanslyContext);

  const sleep = (duration: number) => {
    return new Promise<void>((resolve) => [
      setTimeout(() => {
        resolve();
      }, duration),
    ]);
  };

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
