import { Fansly, OF } from "./sites/index.js";

async function main() {
  //Why do we need this?
  // const proxy = process.env.HTTPS_PROXY;

  const xbc = process.env.XBC;
  const sess = process.env.OF_SESS;
  const authId = process.env.AUTH_ID;
  const apiKey = process.env.API_KEY;

  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  if (!sess) {
    throw new Error("OF_SESS env variable was not set");
  }
  if (!authId) {
    throw new Error("Auth id env variable was not set");
  }
  if (!apiKey) {
    throw new Error("API env variable was not set");
  }


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
  //341475026
  //247353612

  const messageHistory = await OF.Sdk.getFanMessages(authId, "341475026")
  //,make an API call to https://of-2890.onrender.com/api/of/generateResponse and send the messageHistory as the request body
  // keep the Authorization header as: uIs7j!saPqlpK@tam$2s62jfbs!dN
  const payload = {
    messages: messageHistory,
    creator_id: authId,
    fan_id: "341475026"
  }  

  const response = await fetch("https://of-2890.onrender.com/api/of/generateResponse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey
    },
    body: JSON.stringify(payload)
  });
  const responseText = await response.text();
  console.log(responseText);

}

void main();
