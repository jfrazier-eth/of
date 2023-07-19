import * as React from "react";
import Login from "../apps/extension/components/Login.jsx";
import { UserInfoContext } from "../apps/extension/context/user-context.jsx";
import Settings from "../apps/extension/components/Settings.jsx";

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className={`flex h-full flex-col items-center justify-between p-4 bg-white min-w-[30rem] max-w-[30rem] text-black`}
    >
      {children}
    </main>
  );
};

export default function Page() {
  const userInfo = React.useContext(UserInfoContext);

  if (userInfo.isReady) {
    if (userInfo.value.isLoggedIn) {
      return (
        <Main>
          <Settings user={userInfo.value} />
        </Main>
      );
    } else {
      return (
        <Main>
          <Login />
        </Main>
      );
    }
  } else {
    return (
      <Main>
        <div>Loading...</div>
      </Main>
    );
  }
}
