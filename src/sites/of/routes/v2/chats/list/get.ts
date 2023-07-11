import {
    RequestError,
    UnexpectedStatusCodeError,
  } from "@/common/errors/request-errors.js";
  import { SessionContext } from "@/sites/of/context.js";

  import { GetUnreadMessagesResponseBody, GetUnreadMessagesOptions } from "./types.js";

  // const otherHeaders = {
  //   Host: "onlyfans.com",
  //   Referer: 'https://onlyfans.com/my/chats/',
  // };
  const getHeaders = (userId: string) => {
    const headers = {
      Host: "onlyfans.com",
      "User-Id": userId,
      Referer: 'https://onlyfans.com/my/chats/',
    };
  
    return headers;
  };
export const get = async (
    context: SessionContext,
    options: GetUnreadMessagesOptions
  ) => {
    const searchParams = new URLSearchParams({
      limit: `${options.limit ?? 10}`,
      offset: `${options.offset ?? 0}`,
      skip_users: "all",
      order: options.order ?? "recent",
    });
    if (options.filter) {
      searchParams.append('filter', options.filter);
    }
  
    const url = context.getUrl("/api2/v2/chats", searchParams);
    try {
      const contextHeaders = await context.getHeaders(url);
      const reqHeaders = {
        ...getHeaders(context.userParams.authId),
        ...contextHeaders,
      };
  
      const response = await context.client.get<GetUnreadMessagesResponseBody>(url, {
        headers: reqHeaders,
      });
  
      if (response.statusCode === 200) {
        return response.body;
      }
  
      throw new UnexpectedStatusCodeError(url, context, response.statusCode);
    } catch (err) {
      throw RequestError.create(err, url, context);
    }
  };
  