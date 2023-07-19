import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FirebaseAuthProvider } from "../apps/extension/context/firebase-auth-context.jsx";
import { FirebaseUserProvider } from "../apps/extension/context/firebase-user-context.jsx";
import { UserInfoProvider } from "../apps/extension/context/user-context.jsx";

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
