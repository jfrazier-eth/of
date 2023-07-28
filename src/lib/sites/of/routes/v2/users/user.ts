import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { SessionContext } from "@/sites/of/context";

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
  const path = getPath(username);
  const url = context.getUrl(path);

  try {
    const headers = getHeaders(context.userId, username);
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };
    const response = await context.client.get<FanStatsResponseBody>(url, {
      headers: reqHeaders,
    });
    if (response.status === 200) {
      if ("subscribedOnData" in response.body && response.body.subscribedOnData) {
        return {
          id: response.body.id,
          name: response.body.name,
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

      return {
        id: response.body.id,
        name: response.body.name,
        amountSpent: {
          subscribePrice: 0,
          subscribesSum: 0,
          tipsSum: 0,
          messagesSum: 0,
          postsSum: 0,
          streamsSum: 0,
          totalSum: 0,
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

// export const getNewFans = async (
//   context: SessionContext,
//   dates: { startDate: string; endDate: string }
// ) => {
//   const path = "/api2/v2/subscriptions/subscribers/latest";
//   const otherHeaders = {
//     Host: "onlyfans.com",
//     Accept: "application/json, text/plain, */*",
//     Referer: "https://onlyfans.com/my/statistics/fans/subscriptions",
//     "User-id": context.userParams.authId,
//   };
//   let hasMore = true;
//   let offset = 0;
//   let newFans: {
//     id: number;
//     name: string;
//     latestSubscriptionDate: string | null;
//     totalSpent: number;
//     isExpired: boolean;
//   }[] = [];

//   while (hasMore) {
//     const searchParams = new URLSearchParams({
//       startDate: dates.startDate,
//       endDate: dates.endDate,
//       by: "new",
//       offset: offset.toString(),
//     });

//     const url = context.getUrl(path, searchParams);
//     try {
//       const contextHeaders = await context.getHeaders(url);
//       const reqHeaders = {
//         ...otherHeaders,
//         ...contextHeaders,
//       };

//       const response = await context.client.get<NewFansResponseBody>(url, {
//         headers: reqHeaders,
//       });

//       if (response.status === 200) {
//         const currentFans = response.body.users.map((fan) => ({
//           id: fan.id,
//           name: fan.name,
//           latestSubscriptionDate: fan.subscribedOnData?.subscribes?.[0]?.startDate ?? null,
//           totalSpent: fan.subscribedOnData.totalSumm,
//           isExpired: fan.subscribedOnExpiredNow,
//         }));

//         newFans = [...newFans, ...currentFans];
//         hasMore = response.body.hasMore;

//         if (hasMore) {
//           offset += 10;
//         }
//       } else {
//         throw new UnexpectedStatusCodeError(url, context, response.status);
//       }
//     } catch (err) {
//       if (err instanceof UnexpectedStatusCodeError) {
//         throw err;
//       }
//       throw RequestError.create(err, url, context);
//     }
//   }

//   return newFans;
// };
