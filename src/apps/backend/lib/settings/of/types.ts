export interface PGOFSettings {
  user_id: string;
  site_user_id: string;
  created_at: Date;
  updated_at: Date;
  auto_messaging_enabled: boolean;
  spending_threshold: number;
  sample_script: string;
  welcome_message_enabled: boolean;
  welcome_message_id: string;
  favorite_emojis: string;
}

export interface OFSettings {
  userId: string;
  siteUserId: string;
  createdAt: number;
  updatedAt: number;
  settings: {
    autoMessagingEnabled: boolean;
    spendingThreshold: number;
    sampleScript: string;
    welcomeMessageEnabled: boolean;
    welcomeMessageId: string;
    favoriteEmojis: string;
  };
}
