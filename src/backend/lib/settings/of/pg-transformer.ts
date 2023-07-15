import { OFSettings, PGOFSettings } from "./types.js";

export const transformPGOFSettings = (pgSettings: PGOFSettings): OFSettings => {
  const settings: OFSettings = {
    userId: pgSettings.user_id,
    siteUserId: pgSettings.site_user_id,
    createdAt: pgSettings.created_at.getTime(),
    updatedAt: pgSettings.updated_at.getTime(),
    settings: {
      autoMessagingEnabled: pgSettings.auto_messaging_enabled,
      spendingThreshold: pgSettings.spending_threshold,
      sampleScript: pgSettings.sample_script,
      welcomeMessageEnabled: pgSettings.welcome_message_enabled,
      welcomeMessageId: pgSettings.welcome_message_id,
      favoriteEmojis: pgSettings.favorite_emojis,
    },
  };

  return settings;
};

export const transformOFSettings = (params: OFSettings): PGOFSettings => {
  const pgSettings: PGOFSettings = {
    user_id: params.userId,
    site_user_id: params.siteUserId,
    created_at: new Date(params.createdAt),
    updated_at: new Date(params.updatedAt),
    auto_messaging_enabled: params.settings.autoMessagingEnabled,
    spending_threshold: params.settings.spendingThreshold,
    sample_script: params.settings.sampleScript,
    welcome_message_enabled: params.settings.welcomeMessageEnabled,
    welcome_message_id: params.settings.welcomeMessageId,
    favorite_emojis: params.settings.favoriteEmojis,
  };
  return pgSettings;
};
