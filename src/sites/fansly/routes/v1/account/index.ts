import { LoggedInContext } from "@/sites/fansly";
import { RequestError } from "@/common/errors/request-errors";
import phin from "phin";
import axios from "axios";

const path = "/api/v1/account";

const headers = {
  Host: "apiv3.fansly.com",
  Accept: "application/json, text/plain, */*",
  Origin: "https://fansly.com",
  Referer: "https://fansly.com/",
};

export const get = async (context: LoggedInContext) => {
  const url = context.getUrl(path);
  url.searchParams.set("ids", context.userId);
  url.searchParams.set("ngsw-bypass", "true");

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };

    /**
     * phin seems to be unable to parse this response
     */
    const response = await axios.get(url.toString(), {
      headers: reqHeaders,
    });
    console.log(response.data);

    return response.status;
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
