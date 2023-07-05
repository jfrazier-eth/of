import { RequestError } from "@/common/errors/request-errors.js";
import { LoggedInContext } from "@/sites/fansly/context.js";
import axios from "axios";

const path = "/api/v1/account";

const headers = {
  Host: "apiv3.fansly.com",
  Accept: "application/json, text/plain, */*",
  Origin: "https://fansly.com",
  Referer: "https://fansly.com/",
};

/**
 * The me endpoint can be use to get the current user's user id
 * https://apiv3.fansly.com/api/v1/account/me?ngsw-bypass=true
 */

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
