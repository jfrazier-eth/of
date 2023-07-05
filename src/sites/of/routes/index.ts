import { RequestError } from "@/common/errors/request-errors.js";
import { getClient } from "@/common/http/index.js";
import { Context } from "@/common/index.js";

const path = "/";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
};

export const get = async (context: Context) => {
  const url = context.getUrl(path);

  try {
    const client = getClient();
    const response = await client.get(url, {
      headers: {
        ...context.browser.headers,
        ...headers,
      },
    });

    return response.status;
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};

const Home = {
  get,
};

export { Home };
export * as V2 from "./v2/index.js";
