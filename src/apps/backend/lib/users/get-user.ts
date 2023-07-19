import { PGUser } from "./types";
import { transformPGUser } from "./pg-transformer";
import { pg } from "@/backend/db/postgres";

export const getUserByFirebaseId = async (firebaseId: string) => {
  const query = "SELECT * from users WHERE firebase_auth_id = $1";
  const values = [firebaseId];

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
