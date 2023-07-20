import { postLogin } from "@/extension/lib/api/login";
import { getActiveAuth } from "@/extension/lib/auth";

import { ActiveUserInfoMessage, UserInfoMessage } from "../../messages/index";
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
  const cachedUser = await new Promise<StoredUserInfo | null>((resolve, reject) => {
    const key = `user-${uid}`;
    chrome.storage.local.get(key, (result) => {
      try {
        const value = JSON.parse(result[key]) as StoredUserInfo;
        resolve(value);
      } catch (err) {
        resolve(null);
      }
    });
  });

  return cachedUser;
};

const getActiveUser = async () => {
  const activeUser = await new Promise<StoredUserInfo | null>((resolve, reject) => {
    const key = `user-active`;
    chrome.storage.local.get(key, (result) => {
      try {
        const value = JSON.parse(result[key]) as StoredUserInfo;
        resolve(value);
      } catch (err) {
        resolve(null);
      }
    });
  });

  return activeUser;
};

const setCachedUser = async (user: StoredUserInfo) => {
  const key = `user-${user.firebase.uid}`;
  const activeUser = `user-active`;
  console.log(`Setting active user`, user);
  return new Promise<void>((resolve) => {
    chrome.storage.local.set(
      {
        [key]: JSON.stringify(user),
        [activeUser]: JSON.stringify(user),
      },
      resolve
    );
  });
};

export const handleActiveUserInfoMessage: Handler<ActiveUserInfoMessage> = async (
  message,
  context
) => {
  const user = await getActiveUser();
  console.log(`Active user`, user);

  if (user?.api) {
    const cachedOfAuth = await getActiveAuth();
    return {
      kind: "ACTIVE_USER_INFO",
      data: {
        isLoggedIn: true,
        userId: user.api.userId,
        apiKey: user.api.apiKey,
        of: {
          auth: cachedOfAuth,
        },
      },
    };
  }

  return {
    kind: "ACTIVE_USER_INFO",
    data: {
      isLoggedIn: false,
    },
  };
};

export const handleUserInfoMessage: Handler<UserInfoMessage> = async (message, context) => {
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
        return {
          kind: "USER_INFO",
          data: {
            isLoggedIn: true,
            userId: result.userId,
            apiKey: result.apiKey,
          },
        };
      } catch (err) {
        return {
          kind: "USER_INFO",
          data: {
            isLoggedIn: false,
          },
        };
      }
    } else {
      return {
        kind: "USER_INFO",
        data: {
          isLoggedIn: false,
        },
      };
    }
  }

  // return the api key
  if (user.api) {
    context.user = {
      userId: user.api.userId,
      apiKey: user.api.apiKey,
    };
    return {
      kind: "USER_INFO",
      data: {
        apiKey: user.api.apiKey,
        userId: user.api.userId,
        isLoggedIn: true,
      },
    };
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

    return {
      kind: "USER_INFO",
      data: {
        isLoggedIn: true,
        userId: result.userId,
        apiKey: result.apiKey,
      },
    };
  } catch (err) {
    return {
      kind: "USER_INFO",
      data: {
        isLoggedIn: false,
      },
    };
  }
};
