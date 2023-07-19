import { OFLogin, PGOFLogin } from "./types";

export const transformPGOFLogin = (login: PGOFLogin): OFLogin => {
  return {
    params: {
      xbc: login.xbc,
      sess: login.sess,
      authId: login.site_user_id,
    },
    siteUserId: login.site_user_id,
    userId: login.user_id,
    createdAt: new Date(login.created_at).getTime(),
    updatedAt: new Date(login.updated_at).getTime(),
  };
};

export const transformOFLogin = (login: OFLogin): PGOFLogin => {
  return {
    xbc: login.params.xbc,
    sess: login.params.sess,
    site_user_id: login.siteUserId,
    user_id: login.userId,
    created_at: new Date(login.createdAt),
    updated_at: new Date(login.updatedAt),
  };
};
