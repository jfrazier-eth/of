import { pg } from "@/backend/db/postgres";

import { getUserMedia } from "../../user-media";
import { transformPGOFSettings } from "./pg-transformer";
import { saveSettings } from "./save-settings";
import { OFSettings, PGOFSettings } from "./types";

export const getSettings = async (userId: string, siteUserId: string): Promise<OFSettings> => {
  const query = "SELECT * from of_settings WHERE site_user_id = $1";
  const values = [siteUserId];
  const result = await pg.query<PGOFSettings[]>(query, values);
  console.assert(
    result.length <= 1,
    `Received multiple settings with the same site_user_id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    const pgSettings = result[0];

    const promises = [
      pgSettings.welcome_media_id,
      pgSettings.primary_ppv_media_id,
      pgSettings.secondary_ppv_media_id,
    ].map((id) => {
      return id ? getUserMedia(id) : Promise.resolve(null);
    });
    const [welcomeMedia, primaryPPVMedia, secondaryPPVMedia] = await Promise.all(promises);
    return transformPGOFSettings(pgSettings, {
      primaryPPV: primaryPPVMedia,
      secondaryPPV: secondaryPPVMedia,
      welcome: welcomeMedia,
    });
  }

  const now = Date.now();
  const defaultSettings: OFSettings = {
    userId,
    siteUserId,
    createdAt: now,
    updatedAt: now,
    settings: {
      generativeMessaging: {
        script: "",
        emojis: "",
      },
      autoMessaging: {
        enabled: false,
        spendingThreshold: 0,
        primaryPPV: {
          media: null,
          price: 0,
        },
        secondaryPPV: {
          media: null,
          price: 0,
        },
      },
      welcome: {
        enabled: false,
        message: "",
        price: 0,
        media: null,
      },
    },
  };

  await saveSettings(
    {
      userId,
      siteUserId,
    },
    defaultSettings
  );
  return defaultSettings;
};
