import { RequestError } from "@/api/errors/request-errors";
import { LoggedInContext } from "../../../context";

import phin from "phin";

const path = "/api2/v2/init";

const headers = {
  Host: "onlyfans.com",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Referer: "https://onlyfans.com/",
  Accept: "application/json, text/plain, */*",
};

export const get = async (context: LoggedInContext) => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };

    console.log(reqHeaders);
    const response = await phin({
      method: "GET",
      url,
      headers: reqHeaders,
    });

    console.log(`Init Status Code ${response.statusCode}`);
    console.log(response.body.toString());
    console.log(response.headers);
    return response.statusCode;
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
