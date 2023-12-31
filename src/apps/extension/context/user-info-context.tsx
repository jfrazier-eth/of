import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { UserInfo } from "../lib/extension/background/message-handlers/user-info";
import { UserInfoMessage, sendMessage } from "../lib/extension/messages/index";
import { Data } from "./data";
import { FirebaseUserContext } from "./firebase-user-context";

const UserInfoContext = createContext<Data<UserInfo>>({
  isReady: false,
});

const UserInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<Data<UserInfo>>({ isReady: false });
  const firebaseUser = useContext(FirebaseUserContext);

  useEffect(() => {
    let isMounted = true;

    if (!firebaseUser.isReady) {
      return;
    }

    if (firebaseUser.value.user) {
      const userInfoRequest: UserInfoMessage = {
        kind: "USER_INFO",
        data: {
          uid: firebaseUser.value.user.uid,
          tokenId: firebaseUser.value.user.tokenId,
        },
      };
      sendMessage(userInfoRequest)
        .then((response) => {
          if (response.isErr()) {
            throw response.error;
          }
          if (isMounted) {
            setValue({ isReady: true, value: response.value.data });
          }
        })
        .catch((err) => {
          console.error(err);
          if (isMounted) {
            setValue({
              isReady: true,
              value: {
                isLoggedIn: false,
              },
            });
          }
        });
    } else {
      setValue({
        isReady: true,
        value: {
          isLoggedIn: false,
        },
      });
    }
  }, [sendMessage, setValue, firebaseUser]);

  return <UserInfoContext.Provider value={value}>{children}</UserInfoContext.Provider>;
};

export { UserInfoContext, UserInfoProvider };
