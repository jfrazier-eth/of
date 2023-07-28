import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { ClientOFSettings } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/settings/types";

import { sendMessage } from "../../lib/extension/messages";
import { Data } from "../data";
import { UserInfoContext } from "../user-info-context";

interface UserOFSettingsContextValue {
  settings: Data<ClientOFSettings>;
  setSettings: (handler: (prevState: ClientOFSettings) => ClientOFSettings) => void;
  saveSettings: () => Promise<void>;
}

export const UserOFSettingsContext = createContext<UserOFSettingsContextValue>({
  settings: { isReady: false },
  setSettings: () => {},
  saveSettings: async () => {},
});

export const UserOFSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userInfo = useContext(UserInfoContext);
  const [value, setValue] = useState<Data<ClientOFSettings>>({ isReady: false });

  useEffect(() => {
    if (!userInfo.isReady || !userInfo.value.isLoggedIn) {
      return;
    }

    let isMounted = true;

    sendMessage({
      kind: "GET_OF_SETTINGS",
    })
      .then((res) => {
        if (!isMounted) return;
        if (res.isErr()) {
          console.error(res.error);
          return;
        }

        setValue({
          isReady: true,
          value: res.value.data.settings,
        });
      })
      .catch((err) => {
        console.error(`Failed to get user OF settings`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [userInfo, sendMessage]);

  const saveSettings = async () => {
    if (value.isReady) {
      await sendMessage({
        kind: "SAVE_OF_SETTINGS",
        data: value.value,
      });
    } else {
      throw new Error("Settings not found");
    }
  };

  return (
    <UserOFSettingsContext.Provider
      value={{
        settings: value,
        setSettings: (handler: (prevState: ClientOFSettings) => ClientOFSettings) => {
          setValue((prev) => {
            if (!prev.isReady) {
              throw new Error("Settings not found");
            }
            return {
              isReady: true,
              value: handler(prev.value),
            };
          });
        },
        saveSettings,
      }}
    >
      {children}
    </UserOFSettingsContext.Provider>
  );
};
