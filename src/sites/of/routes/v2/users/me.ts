import { LoggedInContext } from "@/sites/of/context.js";
import { HttpsProxyAgent } from "https-proxy-agent";
import got from "got";
import { RequestError } from "@/common/errors/request-errors.js";

const path = "/api2/v2/users/me";

const headers = {
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: "https://onlyfans.com/",
};

export const get = async (context: LoggedInContext) => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };

    const agent = new HttpsProxyAgent(new URL("http://127.0.0.1:4444"));
    console.log(JSON.stringify(reqHeaders, null, 2));
    const response = await got(url.toString(), {
      headers: reqHeaders,
      https: {
        rejectUnauthorized: false,
      },
      agent: {
        https: agent,
      },
    });

    console.log(`Me Status Code ${response.statusCode}`);
    console.log(response.body.toString());
    console.log(response.headers);
    return response.statusCode;
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
