import { GetRequest, UserSiteAuthResponse } from "@/backend/controllers/types";
import { Site } from "@/backend/lib/accounts/types";

import { GetLoginResponseBody } from "./types";

export const get = async (
  req: GetRequest,
  res: UserSiteAuthResponse<GetLoginResponseBody<Site>>
) => {
  res.status(200).json({
    params: res.locals.siteLogin,
  });
};
