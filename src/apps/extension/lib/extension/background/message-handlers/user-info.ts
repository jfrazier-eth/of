import { ok } from "neverthrow";

import { postLogin } from "@/extension/lib/api/login";
import { getActiveAuth } from "@/extension/lib/auth";
import { parseError } from "@/utils/parse-error";

import { ActiveUserInfoMessage, UserInfoMessage } from "../../messages/index";
import { Storage } from "../../storage";
import { Handler } from "./types";

export interface LoggedInUser {
  apiKey: string;
  userId: string;
  isLoggedIn: true;
}

export interface LoggedOutUser {
  isLoggedIn: false;
}

export type UserInfo = LoggedInUser | LoggedOutUser;

interface StoredUserInfo {
  firebase: {
    uid: string;
    tokenId: string;
  };
  api: {
    apiKey: string;
    userId: string;
  } | null;
}

const getCachedUser = async (uid: string) => {
  const key = `user-${uid}`;
  const cachedUser = await Storage.getObject<StoredUserInfo>(key);
  return cachedUser;
};

const getActiveUser = async () => {
  const key = `user-active`;
  const activeUser = await Storage.getObject<StoredUserInfo>(key);
  return activeUser;
};

const setCachedUser = async (user: StoredUserInfo) => {
  const key = `user-${user.firebase.uid}`;
  const activeUser = `user-active`;
  console.log(`Setting active user`, user);
  return await Storage.set({
    [key]: user,
    [activeUser]: user,
  });
};

export const getActiveUserInfo = async (): Promise<ReturnType<Handler<ActiveUserInfoMessage>>> => {
  try {
    const user = await getActiveUser();
    if (user?.api) {
      const cachedOfAuth = await getActiveAuth();
      return ok({
        kind: "ACTIVE_USER_INFO",
        data: {
          isLoggedIn: true,
          userId: user.api.userId,
          apiKey: user.api.apiKey,
          of: {
            auth: cachedOfAuth,
          },
        },
      });
    }

    return ok({
      kind: "ACTIVE_USER_INFO",
      data: {
        isLoggedIn: false,
      },
    });
  } catch (err) {
    return parseError(err);
  }
};

export const handleActiveUserInfoMessage: Handler<ActiveUserInfoMessage> = async (
  message,
  context
) => {
  return await getActiveUserInfo();
};

export const handleUserInfoMessage: Handler<UserInfoMessage> = async (message, context) => {
  try {
    let user = await getCachedUser(message.data.uid);

    if (!user) {
      if (message.data.tokenId) {
        // attempt to login
        try {
          const result = await postLogin(message.data.tokenId, context);
          user = {
            firebase: {
              uid: message.data.uid,
              tokenId: message.data.tokenId,
            },
            api: {
              apiKey: result.apiKey,
              userId: result.userId,
            },
          };
          await setCachedUser(user);
          context.user = {
            userId: result.userId,
            apiKey: result.apiKey,
          };
          return ok({
            kind: "USER_INFO",
            data: {
              isLoggedIn: true,
              userId: result.userId,
              apiKey: result.apiKey,
            },
          });
        } catch (err) {
          return ok({
            kind: "USER_INFO",
            data: {
              isLoggedIn: false,
            },
          });
        }
      } else {
        return ok({
          kind: "USER_INFO",
          data: {
            isLoggedIn: false,
          },
        });
      }
    }

    // return the api key
    if (user.api) {
      context.user = {
        userId: user.api.userId,
        apiKey: user.api.apiKey,
      };
      return ok({
        kind: "USER_INFO",
        data: {
          apiKey: user.api.apiKey,
          userId: user.api.userId,
          isLoggedIn: true,
        },
      });
    }

    try {
      const result = await postLogin(user.firebase.tokenId, context);

      user = {
        firebase: {
          uid: message.data.uid,
          tokenId: user.firebase.tokenId,
        },
        api: {
          apiKey: result.apiKey,
          userId: result.userId,
        },
      };
      context.user = {
        userId: result.userId,
        apiKey: result.apiKey,
      };
      await setCachedUser(user);

      return ok({
        kind: "USER_INFO",
        data: {
          isLoggedIn: true,
          userId: result.userId,
          apiKey: result.apiKey,
        },
      });
    } catch (err) {
      return ok({
        kind: "USER_INFO",
        data: {
          isLoggedIn: false,
        },
      });
    }
  } catch (err) {
    return parseError(err);
  }
};
