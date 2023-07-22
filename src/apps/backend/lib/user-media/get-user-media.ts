import { pg } from "@/backend/db/postgres";

import { transformPGUserMedia } from "./pg-transformer";
import { PGUserMedia, UserMedia } from "./types";

export const getUserMedia = async (mediaId: string): Promise<UserMedia | null> => {
  const query = "SELECT * FROM user_media WHERE id = $1";
  const values = [mediaId];

  const result = await pg.query<PGUserMedia[]>(query, values);

  console.assert(
    result.length <= 1,
    `Received multiple settings with the same site_user_id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    return transformPGUserMedia(result[0]);
  }
  return null;
};
