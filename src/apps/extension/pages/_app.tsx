import { FirebaseAuthProvider } from "@/context/firebase-auth-context";
import { FirebaseUserProvider } from "@/context/firebase-user-context";
import { UserInfoProvider } from "@/context/user-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

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
