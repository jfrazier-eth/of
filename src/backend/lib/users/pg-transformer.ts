import { PGUser, User } from "./types.js";

export const transformPgUser = (pgUser: PGUser): User => {
  return {
    id: pgUser.id,
    apiKey: pgUser.api_key,
    name: pgUser.name,
    username: pgUser.username,
    firebaseAuthId: pgUser.firebase_auth_id,
    createdAt: new Date(pgUser.created_at).getTime(),
  };
};

export const transformUser = (user: User): PGUser => {
  return {
    id: user.id,
    api_key: user.apiKey,
    name: user.name,
    username: user.username,
    firebase_auth_id: user.firebaseAuthId,
    created_at: new Date(user.createdAt),
  };
};
