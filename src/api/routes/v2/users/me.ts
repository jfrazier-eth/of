import { LoggedInContext } from "@/api/context";
import { RequestError } from "@/api/errors/request-errors";
import phin from "phin";

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

    console.log(JSON.stringify(reqHeaders, null, 2));

    const response = await phin({
      method: "GET",
      url,
      headers: reqHeaders,
    });
    console.log(`Me Status Code ${response.statusCode}`);
    console.log(response.body.toString());
    console.log(response.headers);
    return response.statusCode;
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
