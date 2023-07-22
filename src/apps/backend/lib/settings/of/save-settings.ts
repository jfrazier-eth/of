import { pg, pgp } from "@/backend/db/postgres";
import { uid } from "@/utils/uid";

import { savePGUserMedia } from "../../user-media/save-user-media";
import { UserMedia } from "../../user-media/types";
import { transformOFSettings } from "./pg-transformer";
import { OFSettings } from "./types";

export type SaveUserMediaParams = Pick<
  UserMedia,
  "type" | "squarePreview" | "source" | "mediaCreatedAt" | "siteMediaId"
> & {
  id?: UserMedia["id"];
  createdAt?: UserMedia["createdAt"];
};

export type SaveOFSettingsParams = Pick<OFSettings, "userId" | "siteUserId" | "updatedAt"> & {
  createdAt?: OFSettings["createdAt"];
  settings: {
    generativeMessaging: OFSettings["settings"]["generativeMessaging"];
    autoMessaging: {
      enabled: boolean;
      spendingThreshold: number;
      primaryPPV: {
        media: SaveUserMediaParams | null;
        price: number;
      };
      secondaryPPV: {
        media: SaveUserMediaParams | null;
        price: number;
      };
    };
    welcome: {
      enabled: boolean;
      message: string;
      price: number;
      media: SaveUserMediaParams | null;
    };
  };
};

const getFullMedia = (
  params: SaveUserMediaParams | null,
  settingParams: Pick<SaveOFSettingsParams, "userId" | "siteUserId">,
  now: number
): UserMedia | null => {
  if (!params) {
    return null;
  }

  return {
    id: params.id ?? uid(),
    userId: settingParams.userId,
    siteUserId: settingParams.siteUserId,
    createdAt: params.createdAt ?? now,
    updatedAt: now,
    type: params.type,
    squarePreview: params.squarePreview,
    source: params.source,
    mediaCreatedAt: params.mediaCreatedAt,
    siteMediaId: params.siteMediaId,
  };
};

export const saveSettings = async (
  user: { userId: string; siteUserId: string },
  params: Omit<SaveOFSettingsParams, "userId" | "siteUserId">
) => {
  const now = Date.now();

  const { pgSettings, media } = transformOFSettings({
    userId: user.userId,
    siteUserId: user.siteUserId,
    createdAt: params.createdAt ?? now,
    updatedAt: now,
    settings: {
      generativeMessaging: {
        ...params.settings.generativeMessaging,
      },
      autoMessaging: {
        enabled: params.settings.autoMessaging.enabled,
        spendingThreshold: params.settings.autoMessaging.spendingThreshold,
        primaryPPV: {
          price: params.settings.autoMessaging.primaryPPV.price,
          media: getFullMedia(params.settings.autoMessaging.primaryPPV.media, user, now),
        },
        secondaryPPV: {
          price: params.settings.autoMessaging.secondaryPPV.price,
          media: getFullMedia(params.settings.autoMessaging.secondaryPPV.media, user, now),
        },
      },
      welcome: {
        enabled: params.settings.welcome.enabled,
        message: params.settings.welcome.message,
        price: params.settings.welcome.price,
        media: getFullMedia(params.settings.welcome.media, user, now),
      },
    },
  });

  const columns = Object.keys(pgSettings);
  const columnSet = new pgp.helpers.ColumnSet(columns, {
    table: "of_settings",
  });

  const insert = pgp.helpers.insert(pgSettings, columnSet);

  const excludedColumns = columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
  const query = `${insert} ON CONFLICT (site_user_id) of DO UPDATE SET ${excludedColumns}`;
  try {
    const primary = savePGUserMedia(media.primaryPPV);
    const secondary = savePGUserMedia(media.secondaryPPV);
    const welcome = savePGUserMedia(media.welcome);
    await Promise.all([primary, secondary, welcome]);
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of settings`, err);
    throw err;
  }
};
