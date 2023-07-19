export interface PGOFLogin {
  xbc: string;
  sess: string;
  site_user_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface OFLogin {
  params: {
    xbc: string;
    sess: string;
    authId: string;
  };
  siteUserId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}
