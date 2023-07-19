export enum Site {
  OF = "of",
}

export interface PGAccount {
  user_id: string;
  site: Site;
  site_user_id: string;
  created_at: Date;
}

export interface Account {
  userId: string;
  site: Site;
  siteUserId: string;
  createdAt: number;
}
