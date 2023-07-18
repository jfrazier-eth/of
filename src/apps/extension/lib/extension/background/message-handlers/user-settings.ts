import { UserSettingsMessage } from "../../messages/index.js";
import { Handler } from "./types.js";

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
      blur: true,
      blurRadiusRem: 20,
    },
    videos: {
      blur: true,
      blurRadiusRem: 50,
    },
    text: {
      blur: true,
      unBlurOnHover: true,
    },
  },
};

export const handleUserSettingsMessage: Handler<UserSettingsMessage> = async (
  message
) => {
  return Promise.resolve({
    kind: "USER_SETTINGS",
    data: DEFAULT_USER_SETTINGS,
  });
};
