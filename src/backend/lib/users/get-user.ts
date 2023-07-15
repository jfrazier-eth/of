import { pg } from "@/backend/db/postgres.js";
import { PGUser } from "./types.js";
import { transformPGUser } from "./pg-transformer.js";

export const getUser = async (id: string) => {
  const query = "SELECT * from users WHERE id = $1";
  const values = [id];

  const result = await pg.query<PGUser[]>(query, values);

  console.assert(
    result.length <= 1,
    `Received multiple users with the same id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    return transformPGUser(result[0]);
  }
  return null;
};
