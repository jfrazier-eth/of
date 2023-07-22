import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { SessionContext } from "@/sites/of/context";

import { FanStatsResponseBody, NewFansResponseBody } from "./types";

export const getFanHandle = async (context: SessionContext, fanId: string) => {
  const otherHeaders = {
    Host: "onlyfans.com",
    Accept: "application/json, text/plain, */*",
    Referer: `https://onlyfans.com/my/chats/chat/${fanId}/`,
    "User-id": context.userParams.authId,
  };
  const url = new URL(`https://onlyfans.com/api2/v2/users/list?m[]=${fanId}`);
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...otherHeaders,
      ...contextHeaders,
    };
    const response = await context.client.get<any>(url, {
      headers: reqHeaders,
    });
    if (response.status === 200) {
      return {
        id: fanId,
        name: response.body[fanId].name,
        username: response.body[fanId].username,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    if (err instanceof UnexpectedStatusCodeError) {
      throw err;
    }
    throw RequestError.create(err, url, context);
  }
};

export const getFanStats = async (context: SessionContext, fanHandle: string) => {
  const path = `/api2/v2/users/${fanHandle}`;
  const url = context.getUrl(path);
  const otherHeaders = {
    Host: "onlyfans.com",
    Accept: "application/json, text/plain, */*",
    Referer: `https://onlyfans.com/${fanHandle}`,
    "User-id": context.userParams.authId,
  };
  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...otherHeaders,
      ...contextHeaders,
    };
    const response = await context.client.get<FanStatsResponseBody>(url, {
      headers: reqHeaders,
    });
    if (response.status === 200) {
      return {
        fan_id: response.body.id,
        name: response.body.name,
        status: {
          joinDate: response.body.joinDate,
          lastSeen: response.body.lastSeen,
          subscribedAt: response.body.subscribedOnData.subscribeAt,
          renewedAt: response.body.subscribedOnData.renewedAt,
          subscriptionDuration: response.body.subscribedOnData.duration,
          activeSubscription: response.body.subscribedOnData.hasActivePaidSubscriptions,
        },
        amountSpent: {
          subscribePrice: response.body.subscribedOnData.subscribePrice,
          subscribesSum: response.body.subscribedOnData.subscribesSumm,
          tipsSum: response.body.subscribedOnData.tipsSumm,
          messagesSum: response.body.subscribedOnData.messagesSumm,
          postsSum: response.body.subscribedOnData.postsSumm,
          streamsSum: response.body.subscribedOnData.streamsSumm,
          totalSum: response.body.subscribedOnData.totalSumm,
        },
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    if (err instanceof UnexpectedStatusCodeError) {
      throw err;
    }
    throw RequestError.create(err, url, context);
  }
};

export const getNewFans = async (
  context: SessionContext,
  dates: { startDate: string; endDate: string }
) => {
  const path = "/api2/v2/subscriptions/subscribers/latest";
  const otherHeaders = {
    Host: "onlyfans.com",
    Accept: "application/json, text/plain, */*",
    Referer: "https://onlyfans.com/my/statistics/fans/subscriptions",
    "User-id": context.userParams.authId,
  };
  let hasMore = true;
  let offset = 0;
  let newFans: {
    id: number;
    name: string;
    latestSubscriptionDate: string | null;
    totalSpent: number;
    isExpired: boolean;
  }[] = [];

  while (hasMore) {
    const searchParams = new URLSearchParams({
      startDate: dates.startDate,
      endDate: dates.endDate,
      by: "new",
      offset: offset.toString(),
    });

    const url = context.getUrl(path, searchParams);
    try {
      const contextHeaders = await context.getHeaders(url);
      const reqHeaders = {
        ...otherHeaders,
        ...contextHeaders,
      };

      const response = await context.client.get<NewFansResponseBody>(url, {
        headers: reqHeaders,
      });

      if (response.status === 200) {
        const currentFans = response.body.users.map((fan) => ({
          id: fan.id,
          name: fan.name,
          latestSubscriptionDate: fan.subscribedOnData?.subscribes?.[0]?.startDate ?? null,
          totalSpent: fan.subscribedOnData.totalSumm,
          isExpired: fan.subscribedOnExpiredNow,
        }));

        newFans = [...newFans, ...currentFans];
        hasMore = response.body.hasMore;

        if (hasMore) {
          offset += 10;
        }
      } else {
        throw new UnexpectedStatusCodeError(url, context, response.status);
      }
    } catch (err) {
      if (err instanceof UnexpectedStatusCodeError) {
        throw err;
      }
      throw RequestError.create(err, url, context);
    }
  }

  return newFans;
};
