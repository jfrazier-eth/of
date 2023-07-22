import { Site } from "@/backend/lib/accounts/types";
import { LoginParamsBySite } from "@/backend/lib/logins/get-login";

export interface GetLoginResponseBody<S extends Site> {
  params: LoginParamsBySite[S];
}

export interface PostLoginRequestBody<S extends Site> {
  params: LoginParamsBySite[S];
}
