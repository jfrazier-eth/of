import { Result } from "neverthrow";

import { PGError, pgQueryOneOrNone } from "@/backend/db/postgres";

import { transformPGUserMedia } from "./pg-transformer";
import { PGUserMedia, UserMedia } from "./types";

export const getUserMedia = async (mediaId: string): Promise<Result<UserMedia | null, PGError>> => {
  const query = "SELECT * FROM user_media WHERE id = $1";
  const values = [mediaId];

  const result = await pgQueryOneOrNone<PGUserMedia>(query, values);

  return result.map((media) => {
    if (media == null) {
      return null;
    }
    return transformPGUserMedia(media);
  });
};
