import { GetRequest, UserSiteAuthResponse } from "@/backend/controllers/types";
import { Site } from "@/backend/lib/accounts/types";
import { OFSettings, getSettings } from "@/backend/lib/settings/of";

export const get = async (_req: GetRequest, res: UserSiteAuthResponse<OFSettings>) => {
  try {
    let settings;
    switch (res.locals.site) {
      case Site.OF: {
        settings = await getSettings(res.locals.userId, res.locals.siteUserId);
        break;
      }
    }
    if (settings.isErr()) {
      return res.sendStatus(500);
    }
    return res.status(200).json(settings.value);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
