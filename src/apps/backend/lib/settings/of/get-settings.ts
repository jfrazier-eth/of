import { Result, err, ok } from "neverthrow";

import { PGError, pg, pgQuery } from "@/backend/db/postgres";

import { UserMedia, getUserMedia } from "../../user-media";
import { transformPGOFSettings } from "./pg-transformer";
import { saveSettings } from "./save-settings";
import { OFSettings, PGOFSettings } from "./types";

const getMedia = async (
  pgSettings: PGOFSettings
): Promise<
  Result<
    {
      welcomeMedia: UserMedia | null;
      primaryPPVMedia: UserMedia | null;
      secondaryPPVMedia: UserMedia | null;
    },
    PGError
  >
> => {
  const promises = [
    pgSettings.welcome_media_id,
    pgSettings.primary_ppv_media_id,
    pgSettings.secondary_ppv_media_id,
  ].map((id) => {
    return id ? getUserMedia(id) : Promise.resolve(null);
  });

  const results = await Promise.all(promises);
  const okValues = [];
  for (const result of results) {
    if (result && result.isErr()) {
      return err(result.error);
    }
    okValues.push(result?.value ?? null);
  }

  const [welcomeMedia, primaryPPVMedia, secondaryPPVMedia] = okValues;
  return ok({
    welcomeMedia,
    primaryPPVMedia,
    secondaryPPVMedia,
  });
};

export const getSettings = async (
  userId: string,
  siteUserId: string
): Promise<Result<OFSettings, PGError>> => {
  const query = "SELECT * from of_settings WHERE site_user_id = $1";
  const values = [siteUserId];
  const result = await pg.query<PGOFSettings[]>(query, values);
  console.assert(
    result.length <= 1,
    `Received multiple settings with the same site_user_id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    const pgSettings = result[0];

    const mediaRes = await getMedia(pgSettings);
    if (mediaRes.isErr()) {
      return err(mediaRes.error);
    }
    const { primaryPPVMedia, secondaryPPVMedia, welcomeMedia } = mediaRes.value;
    return ok(
      transformPGOFSettings(pgSettings, {
        primaryPPV: primaryPPVMedia,
        secondaryPPV: secondaryPPVMedia,
        welcome: welcomeMedia,
      })
    );
  }

  const now = Date.now();
  const defaultSettings: OFSettings = {
    userId,
    siteUserId,
    createdAt: now,
    updatedAt: now,
    settings: {
      generativeMessaging: {
        script: "",
        emojis: "",
      },
      autoMessaging: {
        enabled: false,
        spendingThreshold: 0,
        primaryPPV: {
          media: null,
          price: 0,
        },
        secondaryPPV: {
          media: null,
          price: 0,
        },
      },
      welcome: {
        enabled: false,
        message: "",
        price: 0,
        media: null,
      },
    },
  };

  await saveSettings(
    {
      userId,
      siteUserId,
    },
    defaultSettings
  );
  return ok(defaultSettings);
};

export async function* getUsersWithAutoMessagingEnabled(): AsyncGenerator<
  Result<{ settings: OFSettings }, PGError>
> {
  const query =
    "SELECT * from of_settings WHERE auto_messaging_enabled = $1 AND auto_messaging_spending_threshold > $2";
  const values = [true, 0];
  const result = await pgQuery<PGOFSettings>(query, values);
  if (result.isErr()) {
    yield err(result.error);
    return;
  }

  for (const pgSettings of result.value) {
    const media = await getMedia(pgSettings);
    if (media.isErr()) {
      yield err(media.error);
      continue;
    }
    const { primaryPPVMedia, secondaryPPVMedia, welcomeMedia } = media.value;
    const settings = transformPGOFSettings(pgSettings, {
      primaryPPV: primaryPPVMedia,
      secondaryPPV: secondaryPPVMedia,
      welcome: welcomeMedia,
    });

    yield ok({ settings });
  }
}
