import { Request as ExpressRequest, Response as ExpressResponse } from "express";

import { Site } from "../lib/accounts/types";
import { LoginParamsBySite } from "../lib/logins/get-login";
import { InternalAuthLocals } from "./internal-api-auth";
import { AdminAuthLocals } from "./parse-admin-headers";
import { AuthLocals } from "./user-auth";

export type GetRequest<ReqQuery = {}> = ExpressRequest<unknown, unknown, unknown, ReqQuery>;
export type PostRequest<ReqBody = {}, ReqQuery = {}> = ExpressRequest<
  unknown,
  unknown,
  ReqBody,
  ReqQuery
>;

export type InternalAuthResponse<ResBody> = ExpressResponse<ResBody, InternalAuthLocals>;

export type AdminAuthResponse<ResBody> = ExpressResponse<ResBody, AdminAuthLocals>;
export type AdminAuthResponseWithPromptId<ResBody> = ExpressResponse<
  ResBody,
  AdminAuthLocals & { promptId: string }
>;
export type UserAuthResponse<ResBody> = ExpressResponse<ResBody, AuthLocals>;

export type SiteParamLocals<S> = {
  userIdParam: string;
  site: S;
  siteUserId: string;
};

export type SiteAuthLocals<S extends Site> = AuthLocals &
  SiteParamLocals<S> & { siteLogin: LoginParamsBySite[S] };

/**
 * this type is only meant to be used in the case where you require
 * the SiteParamLocals but do not want them the to be validated
 */
export type UserAuthResponseWithUnsafeParams<ResBody> = ExpressResponse<
  ResBody,
  AuthLocals & SiteParamLocals<Site>
>;

export type UserSiteAuthResponse<ResBody> = ExpressResponse<ResBody, SiteAuthLocals<Site>>;
