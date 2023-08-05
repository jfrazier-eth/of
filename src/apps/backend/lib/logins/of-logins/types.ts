import { UserSessionParams } from "@/sites/of/context";

export interface PGOFLogin {
  xbc: string;
  sess: string;
  auth_uid: string | null;
  user_agent: string;
  site_user_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface OFLogin {
  params: UserSessionParams;
  siteUserId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}
