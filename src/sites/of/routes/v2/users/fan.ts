import { SessionContext } from "@/sites/of/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors.js";
import { FanResponseBody, FanStatsResponseBody } from "./types.js";

export const getFanHandle = async (context: SessionContext, fanId: string) => {
    const otherHeaders = {
        Host: "onlyfans.com",
        Accept: "application/json, text/plain, */*",
        Referer:`https://onlyfans.com/my/chats/chat/${fanId}/`,
    };
    const url = new URL(`https://onlyfans.com/api2/v2/users/list?m[]=${fanId}`);   
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...otherHeaders,
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

export const getFanStats = async (context: SessionContext, fanHandle: string) => {
    const path = `/api2/v2/users/${fanHandle}`;
    const url = context.getUrl(path);
    const otherHeaders = {
        Host: "onlyfans.com",
        Accept: "application/json, text/plain, */*",
        Referer:`https://onlyfans.com/${fanHandle}`,
    };
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...otherHeaders,
      ...contextHeaders,
    };
    console.log(reqHeaders)
    const response = await context.client.get<FanStatsResponseBody>(url, {
      headers: reqHeaders,
    });
    console.log('Response is!')
    console.log(response.body)
    console.log(response.statusCode)
    if (response.statusCode === 200) {
      return {
        fan_id: response.body.id,
        name: response.body.name,
        status: {
            joinDate: response.body.joinDate,
            lastSeen: response.body.lastSeen,
            subscribedAt: response.body.subscribedOnData.subscribedAt,
            renewedAt: response.body.subscribedOnData.renewedAt,
            subscriptionDuration: response.body.subscribedOnData.duration,
            activeSubscription: response.body.subscribedOnData.hasActivePaidSubscriptions,
        },
        amountSpent: {
            subscribePrice: response.body.subscribedOnData.subscribePrice,
            subscribesSum: response.body.subscribedOnData.subscribesSum,
            tipsSum: response.body.subscribedOnData.tipsSum,
            messagesSum: response.body.subscribedOnData.messagesSum,
            postsSum: response.body.subscribedOnData.postsSum,
            streamsSum: response.body.subscribedOnData.streamsSum,
            totalSum: response.body.subscribedOnData.totalSum,
        }
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};