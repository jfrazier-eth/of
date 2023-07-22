import { PGUserMedia, UserMedia } from "./types";

export const transformPGUserMedia = (pgMedia: PGUserMedia | null): UserMedia | null => {
  if (!pgMedia) {
    return null;
  }

  return {
    id: pgMedia.id,
    userId: pgMedia.user_id,
    siteUserId: pgMedia.site_user_id,
    createdAt: new Date(pgMedia.created_at).getTime(),
    updatedAt: new Date(pgMedia.updated_at).getTime(),
    type: pgMedia.type,
    squarePreview: pgMedia.square_preview,
    source: pgMedia.source,
    mediaCreatedAt: new Date(pgMedia.media_created_at).getTime(),
    siteMediaId: pgMedia.site_media_id,
  };
};

export const transformUserMedia = (media: UserMedia | null): PGUserMedia | null => {
  if (!media) {
    return null;
  }

  return {
    id: media.id,
    user_id: media.userId,
    site_user_id: media.siteUserId,
    created_at: new Date(media.createdAt),
    updated_at: new Date(media.updatedAt),
    type: media.type,
    square_preview: media.squarePreview,
    source: media.source,
    media_created_at: new Date(media.createdAt),
    site_media_id: media.siteMediaId,
  };
};
