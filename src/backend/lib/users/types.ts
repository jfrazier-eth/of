export interface PGUser {
  id: string;
  api_key: string;
  name: string;
  username: string;
  firebase_auth_id: string;
  created_at: Date;
}

export interface User {
  id: string;
  apiKey: string;
  name: string;
  username: string;
  firebaseAuthId: string;
  createdAt: number;
}
