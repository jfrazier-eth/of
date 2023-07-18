export interface PGOFPPV {
  id: string;
  site_user_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  image: string;
  price: number;
}

export interface OFPPV {
  id: string;
  siteUserId: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  ppv: {
    image: string;
    price: number;
  };
}
