import { transformUserMedia } from "../../user-media/pg-transformer";
import { PGUserMedia, UserMedia } from "../../user-media/types";
import { OFSettings, PGOFSettings } from "./types";

export const transformPGOFSettings = (
  pgSettings: PGOFSettings,
  media: {
    primaryPPV: UserMedia | null;
    secondaryPPV: UserMedia | null;
    welcome: UserMedia | null;
  }
): OFSettings => {
  const settings: OFSettings = {
    userId: pgSettings.user_id,
    siteUserId: pgSettings.site_user_id,
    createdAt: pgSettings.created_at.getTime(),
    updatedAt: pgSettings.updated_at.getTime(),
    settings: {
      generativeMessaging: {
        script: pgSettings.generative_messaging_script,
        emojis: pgSettings.generative_messaging_emojis,
      },
      autoMessaging: {
        enabled: pgSettings.auto_messaging_enabled,
        spendingThreshold: pgSettings.auto_messaging_spending_threshold,
        primaryPPV: {
          media: media.primaryPPV,
          price: pgSettings.primary_ppv_price,
        },
        secondaryPPV: {
          media: media.secondaryPPV,
          price: pgSettings.secondary_ppv_price,
        },
      },
      welcome: {
        enabled: pgSettings.welcome_enabled,
        message: pgSettings.welcome_message,
        price: pgSettings.welcome_price,
        media: media.welcome,
      },
    },
  };

  return settings;
};

export const transformOFSettings = (
  params: OFSettings
): {
  pgSettings: PGOFSettings;
  media: {
    primaryPPV: PGUserMedia | null;
    secondaryPPV: PGUserMedia | null;
    welcome: PGUserMedia | null;
  };
} => {
  const pgSettings: PGOFSettings = {
    user_id: params.userId,
    site_user_id: params.siteUserId,
    created_at: new Date(params.createdAt),
    updated_at: new Date(params.updatedAt),
    generative_messaging_script: params.settings.generativeMessaging.script,
    generative_messaging_emojis: params.settings.generativeMessaging.emojis,
    auto_messaging_enabled: params.settings.autoMessaging.enabled,
    auto_messaging_spending_threshold: params.settings.autoMessaging.spendingThreshold,
    primary_ppv_media_id: params.settings.autoMessaging.primaryPPV.media?.id ?? null,
    primary_ppv_price: params.settings.autoMessaging.primaryPPV.price,
    secondary_ppv_media_id: params.settings.autoMessaging.secondaryPPV.media?.id ?? null,
    secondary_ppv_price: params.settings.autoMessaging.secondaryPPV.price,
    welcome_enabled: params.settings.welcome.enabled,
    welcome_message: params.settings.welcome.message,
    welcome_price: params.settings.welcome.price,
    welcome_media_id: params.settings.welcome.media?.id ?? null,
  };

  return {
    pgSettings,
    media: {
      primaryPPV: transformUserMedia(params.settings.autoMessaging.primaryPPV.media),
      secondaryPPV: transformUserMedia(params.settings.autoMessaging.secondaryPPV.media),
      welcome: transformUserMedia(params.settings.welcome.media),
    },
  };
};
