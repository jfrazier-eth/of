import { EmailAuthProvider } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { FirebaseAuthContext } from "../context/firebase-auth-context";
import { SITE_NAME, TARGET_SITE_NAME } from "../lib/constants";

const Login: React.FC = () => {
  const { ui } = useContext(FirebaseAuthContext);

  useEffect(() => {
    if (ui) {
      ui.start("#firebaseui-auth-container", {
        signInOptions: [EmailAuthProvider.PROVIDER_ID],
        callbacks: {
          signInSuccessWithAuthResult: function () {
            return false;
          },
        },
      });
    }
  }, [ui]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-seductive mb-4">
        Welcome to {SITE_NAME}
      </h1>
      <p className="mb-8 text-white">
        To get started, please login to {TARGET_SITE_NAME}
      </p>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Login;
