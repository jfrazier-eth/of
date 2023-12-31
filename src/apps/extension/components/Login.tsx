import { EmailAuthProvider } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";

import { Data } from "../context/data";
import { FirebaseAuthContext } from "../context/firebase-auth-context";
import { SITE_NAME, TARGET_SITE_NAME } from "../lib/constants";
import { UserInfo } from "../lib/extension/background/message-handlers/user-info";

const Login: React.FC<{ userInfo: Data<UserInfo> }> = ({ userInfo }) => {
  const { ui } = useContext(FirebaseAuthContext);
  const [isUIDisplayed, setIsUIDisplayed] = useState(false);

  useEffect(() => {
    if (userInfo.isReady && ui) {
      if (!userInfo.value.isLoggedIn) {
        setIsUIDisplayed(true);
        ui.start("#firebaseui-auth-container", {
          signInOptions: [EmailAuthProvider.PROVIDER_ID],
          callbacks: {
            signInSuccessWithAuthResult: function (auth: any) {
              setIsUIDisplayed(false);
              return false;
            },
          },
        });
      }
    }
  }, [ui, setIsUIDisplayed, userInfo]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-seductive mb-4 text-center">Welcome to {SITE_NAME}</h1>
      {isUIDisplayed ? (
        <p className="mb-4 w-full text-center">Please login/create an account.</p>
      ) : (
        <p className="w-full text-center">
          To get started, login to your {TARGET_SITE_NAME} account or refresh the page.
        </p>
      )}
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Login;
