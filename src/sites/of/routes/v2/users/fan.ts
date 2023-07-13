import { SessionContext } from "@/sites/of/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors.js";
import { FanResponseBody } from "./types.js";


const getHeaders = (fanId: string) => {
    return {
        Host: "onlyfans.com",
        Accept: "application/json, text/plain, */*",
        Referer:`https://onlyfans.com/my/chats/chat/${fanId}/`,
      };
}

export const get = async (context: SessionContext, fanId: string) => {
    const url = new URL(`https://onlyfans.com/api2/v2/users/list?m[]=${fanId}`);   
    console.log('Url is')
    console.log(url)
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(fanId),
      ...contextHeaders,
    };
    const response = await context.client.get<FanResponseBody>(url, {
      headers: reqHeaders,
    });
    console.log(reqHeaders);

    if (response.statusCode === 200) {
      return {
        id: fanId,
        name: response.body.name,
        username: response.body.username,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
