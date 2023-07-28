import { PostRequest, UserSiteAuthResponse } from "@/backend/controllers/types";
import { OFSettings, getSettings } from "@/backend/lib/settings/of";
import { saveSettings } from "@/backend/lib/settings/of/save-settings";

import { ClientOFSettings } from "./types";

export const post = async (
  req: PostRequest<ClientOFSettings>,
  res: UserSiteAuthResponse<OFSettings>
) => {
  try {
    await saveSettings({ userId: res.locals.userId, siteUserId: res.locals.siteUserId }, req.body);
    const settings = await getSettings(res.locals.userId, res.locals.siteUserId);

    if (settings.isErr()) {
      return res.sendStatus(500);
    }

    return res.status(200).json(settings.value);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
};
