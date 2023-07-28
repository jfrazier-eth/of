import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { sendMessage } from "../lib/extension/messages/send-message";
import { Data } from "./data";
import { FirebaseAuthContext } from "./firebase-auth-context";

interface FirebaseUser {
  uid: string;
  tokenId: string;
  apiKey: string;
}

export const FirebaseUserContext = createContext<Data<{ user: FirebaseUser | null }>>({
  isReady: false,
});

export const FirebaseUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Data<{ user: FirebaseUser | null }>>({
    isReady: false,
  });
  const { auth } = useContext(FirebaseAuthContext);

  useEffect(() => {
    let isMounted = true;

    if (auth) {
      const handleAuthChange = async (user: any) => {
        if (user) {
          const { uid } = user;
          const idToken = await user.getIdToken();
          const res = await sendMessage({
            kind: "USER_INFO",
            data: {
              uid,
              tokenId: idToken,
            },
          });
          if (res.isErr()) {
            console.error(res.error);
            return;
          }

          if (!isMounted) {
            return;
          }

          if (res.value.data.isLoggedIn) {
            const firebaseUser: FirebaseUser = {
              uid,
              tokenId: idToken,
              apiKey: res.value.data.apiKey,
            };
            setUser({ isReady: true, value: { user: firebaseUser } });
          } else {
            setUser({ isReady: true, value: { user: null } });
          }
        } else if (isMounted) {
          setUser({ isReady: true, value: { user: null } });
        }
      };

      const unsubscribe = auth.onIdTokenChanged(handleAuthChange);

      return () => {
        unsubscribe();
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [auth, setUser, sendMessage]);

  return <FirebaseUserContext.Provider value={user}>{children}</FirebaseUserContext.Provider>;
};
