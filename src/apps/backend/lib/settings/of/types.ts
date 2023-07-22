import { UserMedia } from "../../user-media/types";

export interface PGOFSettings {
  user_id: string;
  site_user_id: string;
  created_at: Date;
  updated_at: Date;
  generative_messaging_script: string;
  generative_messaging_emojis: string;
  auto_messaging_enabled: boolean;
  auto_messaging_spending_threshold: number;
  primary_ppv_media_id: string | null;
  primary_ppv_price: number;
  secondary_ppv_media_id: string | null;
  secondary_ppv_price: number;
  welcome_enabled: boolean;
  welcome_message: string;
  welcome_price: number;
  welcome_media_id: string | null;
}

export interface OFSettings {
  userId: string;
  siteUserId: string;
  createdAt: number;
  updatedAt: number;
  settings: {
    generativeMessaging: {
      script: string;
      emojis: string;
    };
    autoMessaging: {
      enabled: boolean;
      spendingThreshold: number;
      primaryPPV: {
        media: UserMedia | null;
        price: number;
      };
      secondaryPPV: {
        media: UserMedia | null;
        price: number;
      };
    };
    welcome: {
      enabled: boolean;
      message: string;
      price: number;
      media: UserMedia | null;
    };
  };
}
