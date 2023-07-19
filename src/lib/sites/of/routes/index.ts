import { Context } from "@/sites/common";
import { RequestError } from "@/sites/common/errors/request-errors";

const path = "/";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
};

export const get = async (context: Context) => {
  const url = context.getUrl(path);

  try {
    const response = await context.client.get(url, {
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
export * as V2 from "./v2/index";
