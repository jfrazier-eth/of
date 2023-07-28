import { Result } from "neverthrow";

import { PGError } from "@/backend/db/postgres";

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
): Promise<Result<LoginParamsBySite[S] | null, PGError>> => {
  const handler = getLoginBySite[params.site];
  const login = (await handler(params)) as Result<LoginParamsBySite[S] | null, PGError>;
  return login;
};
