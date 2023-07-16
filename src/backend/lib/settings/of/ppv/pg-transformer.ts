import { OFPPV, PGOFPPV } from "./types.js";

export const transformPGOFPPV = (pgPPV: PGOFPPV): OFPPV => ({
  id: pgPPV.id,
  siteUserId: pgPPV.site_user_id,
  userId: pgPPV.user_id,
  createdAt: pgPPV.created_at.getTime(),
  updatedAt: pgPPV.updated_at.getTime(),
  ppv: {
    image: pgPPV.image,
    price: pgPPV.price,
  },
});

export const transformOFPPV = (ofPPV: OFPPV): PGOFPPV => ({
  id: ofPPV.id,
  site_user_id: ofPPV.siteUserId,
  user_id: ofPPV.userId,
  created_at: new Date(ofPPV.createdAt),

  updated_at: new Date(ofPPV.updatedAt),
  image: ofPPV.ppv.image,
  price: ofPPV.ppv.price,
});
