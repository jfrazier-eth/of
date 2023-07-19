import * as React from "react";

import Login from "@/extension/components/Login";
import Settings from "@/extension/components/Settings";
import { UserInfoContext } from "@/extension/context/user-context";
import { UserOFSettingsContext } from "@/extension/context/user-of-settings";

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
  const { settings, setSettings, saveSettings } = React.useContext(UserOFSettingsContext);
  if (userInfo.isReady) {
    if (userInfo.value.isLoggedIn && settings.isReady) {
      return (
        <Main>
          <Settings settings={settings.value} setSettings={setSettings} saveSettings={saveSettings} />
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
