import { UserSettingsMessage } from "../../messages/index";
import { Handler } from "./types";

export interface UserSettings {
  incognito: {
    images: {
      blur: boolean;
      blurRadiusRem: number;
    };
    videos: {
      blur: boolean;
      blurRadiusRem: number;
    };
    text: {
      blur: boolean;
      unBlurOnHover: boolean;
    };
  };
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  incognito: {
    images: {
      blur: false,
      blurRadiusRem: 20,
    },
    videos: {
      blur: false,
      blurRadiusRem: 50,
    },
    text: {
      blur: false,
      unBlurOnHover: false,
    },
  },
};

export const handleUserSettingsMessage: Handler<UserSettingsMessage> = async (message) => {
  return Promise.resolve({
    kind: "USER_SETTINGS",
    data: DEFAULT_USER_SETTINGS,
  });
};
