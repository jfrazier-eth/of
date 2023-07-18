import { ReactNode, createContext, useEffect, useState } from "react";
import { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7u12-_sxcnbWO198olpP_rrHcagFUDGY",
  authDomain: "seduc-779ff.firebaseapp.com",
  projectId: "seduc-779ff",
  storageBucket: "seduc-779ff.appspot.com",
  messagingSenderId: "49087855959",
  appId: "1:49087855959:web:f54e70d6ed1b17aac09212",
};

// Initialize Firebase
interface FirebaseAuthContextType {
  ui: any | null;
  app: any | null;
  auth: Auth | null;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  ui: null,
  app: null,
  auth: null,
});

const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [ui, setUi] = useState<any | null>(null);
  const [app, setApp] = useState<any | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  useEffect(() => {
    if (
      !!window &&
      !ui &&
      !app &&
      !auth &&
      "firebaseui" in window &&
      "firebase" in window
    ) {
      const windowFirebase = window.firebase as any;
      const firebaseApp: any = windowFirebase.initializeApp(firebaseConfig);
      const auth = windowFirebase.auth();
      const ui = new (window.firebaseui as any).auth.AuthUI(auth);
      setUi(ui);
      setApp(firebaseApp);
      setAuth(auth);
    }
  }, [app, ui]);

  return (
    <FirebaseAuthContext.Provider
      value={{
        ui,
        app,
        auth,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export { FirebaseAuthContext, FirebaseAuthProvider };
