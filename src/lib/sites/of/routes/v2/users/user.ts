
import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { FanStatsResponseBody } from "./types";

const getPath = (username: string) => {
  return `/api2/v2/users/${username}`;
};

const getHeaders = (userId: string, username: string) => ({
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: `https://onlyfans.com/${username}`,
  "User-Id": userId,
});

export const get = async (context: SessionContext, username: string) => {
  try {
    const path = getPath(username);
    const url = context.getUrl(path);


    const headers = getHeaders(context.userId, username);
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };
    const response = await context.client.get<FanStatsResponseBody>(url, {
      headers: reqHeaders,
    });
    if (response.isOk()) {
      const body = response.value.body;
      if ("subscribedOnData" in body && body.subscribedOnData) {
        return ok({
          id: body.id,
          name: body.name,
          amountSpent: {
            subscribePrice: body.subscribedOnData.subscribePrice,
            subscribesSum: body.subscribedOnData.subscribesSumm,
            tipsSum: body.subscribedOnData.tipsSumm,
            messagesSum: body.subscribedOnData.messagesSumm,
            postsSum: body.subscribedOnData.postsSumm,
            streamsSum: body.subscribedOnData.streamsSumm,
            totalSum: body.subscribedOnData.totalSumm,
          },
        });
      }

      return ok({
        id: body.id,
        name: body.name,
        amountSpent: {
          subscribePrice: 0,
          subscribesSum: 0,
          tipsSum: 0,
          messagesSum: 0,
          postsSum: 0,
          streamsSum: 0,
          totalSum: 0,
        },
      });
    }
    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};
