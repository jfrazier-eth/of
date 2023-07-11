import { Browsers } from "./common/index.js";
import { Fansly, OF } from "./sites/index.js";
import { sleep } from "./utils/sleep.js";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const proxy = process.env.HTTPS_PROXY;

  const xbc = process.env.XBC;
  const sess = process.env.OF_SESS;
  const authId = process.env.AUTH_ID;

  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  if (!sess) {
    throw new Error("OF_SESS env variable was not set");
  }
  if (!authId) {
    throw new Error("Auth id env variable was not set");
  }

  const ofContext = new OF.UserContext(
    {
      xbc,
      authId,
      sess: sess,
    },
    {
      baseUrl,
      browser: Browsers.brave,
      proxy,
    }
  );

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

  const session = await OF.Sdk.getSession(ofContext);

  // const otherUserId = "247353612";
  // const messages = await OF.Routes.V2.Chats.User.Messages.Get.get(session, {
  //   otherUserId,
  // });


  // console.log(`Got messages successfully`);
  // await sleep(2000);

  // console.log(`Sending message`);

  // const response = await OF.Routes.V2.Chats.User.Messages.Post.post(session, {
  //   toUserId: otherUserId,
  //   text: "gm",
  // });


  console.log(`retrieved message successfully`);
  //const userDetails = await OF.Sdk.getUserDetails(ofContext);


}

void main();
