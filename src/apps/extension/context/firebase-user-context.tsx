import {
  ReactNode,
  useEffect,
  createContext,
  useState,
  useContext,
} from "react";
import { FirebaseAuthContext } from "./firebase-auth-context.jsx";
import { sendMessage } from "@/lib/extension/messages";
import { Data } from "./data.js";

interface FirebaseUser {
  uid: string;
  tokenId: string;
  apiKey: string;
}

export const FirebaseUserContext = createContext<
  Data<{ user: FirebaseUser | null }>
>({
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

          if (!isMounted) {
            return;
          }

          if (res.data.isLoggedIn) {
            const firebaseUser: FirebaseUser = {
              uid,
              tokenId: idToken,
              apiKey: res.data.apiKey,
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

  return (
    <FirebaseUserContext.Provider value={user}>
      {children}
    </FirebaseUserContext.Provider>
  );
};
