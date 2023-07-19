import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Data } from "./data";

import { FirebaseUserContext } from "./firebase-user-context";
import { UserInfoMessage, sendMessage } from "../lib/extension/messages/index";
import { UserInfo } from "../lib/extension/background/message-handlers/user-info";

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
          if (isMounted) {
            setValue({ isReady: true, value: response.data });
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
  }, [sendMessage, setValue, firebaseUser, firebaseUser.isReady]);

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

export { UserInfoContext, UserInfoProvider };
