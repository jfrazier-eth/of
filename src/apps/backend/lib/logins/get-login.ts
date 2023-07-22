import { Site } from "../accounts/types";
import { OFLogin, getLogin as getOFLogin } from "./of-logins/index";

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

export const getLogin = async <S extends Site>(
  params: GetLoginParams
): Promise<LoginParamsBySite[S] | null> => {
  const handler = getLoginBySite[params.site];
  const login = (await handler(params)) as LoginParamsBySite[S] | null;
  return login;
};
