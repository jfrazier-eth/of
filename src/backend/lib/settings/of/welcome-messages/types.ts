export interface PGOFWelcomeMessage {
  id: string;
  site_user_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  image: string;
  script: string;
  price: number;
}

export interface OFWelcomeMessage {
  id: string;
  siteUserId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  message: {
    image: string;
    script: string;
    price: number;
  };
}
