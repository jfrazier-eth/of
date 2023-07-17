import { Site } from "../accounts/types.js";
import { OFLogin, getLogin as getOFLogin } from "./of-logins/index.js";

export interface GetLoginParams {
  site: Site;
  siteUserId: string;
  userId: string;
}

const getLoginBySite = {
  [Site.OF]: getOFLogin,
};

export type LoginParamsBySite = {
  [Site.OF]: OFLogin["params"];
};

export const getLogin = async (params: GetLoginParams) => {
  const handler = getLoginBySite[params.site];
  const login = await handler(params);
  return login;
};
