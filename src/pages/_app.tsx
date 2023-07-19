import type { AppProps } from "next/app";

import { FirebaseAuthProvider } from "@/extension/context/firebase-auth-context";
import { FirebaseUserProvider } from "@/extension/context/firebase-user-context";
import { UserInfoProvider } from "@/extension/context/user-context";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAuthProvider>
      <FirebaseUserProvider>
        <UserInfoProvider>
          <Component {...pageProps} />
        </UserInfoProvider>
      </FirebaseUserProvider>
    </FirebaseAuthProvider>
  );
}
