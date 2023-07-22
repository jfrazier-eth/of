export type MediaType = "photo" | "video" | "gif" | "audio";

export interface PGUserMedia {
  id: string;
  user_id: string;
  site_user_id: string;
  created_at: Date;
  updated_at: Date;
  type: MediaType;
  square_preview: string;
  source: string;
  media_created_at: Date;
  site_media_id: string;
}

export interface UserMedia {
  id: string;
  userId: string;
  siteUserId: string;
  createdAt: number;
  updatedAt: number;
  type: MediaType;
  squarePreview: string;
  source: string;
  mediaCreatedAt: number;
  siteMediaId: string;
}
