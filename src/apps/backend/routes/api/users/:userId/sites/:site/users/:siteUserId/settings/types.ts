import { SaveOFSettingsParams, SaveUserMediaParams } from "@/backend/lib/settings/of/save-settings";

export type ClientOFSettings = Omit<SaveOFSettingsParams, "userId" | "siteUserId">;
export type ClientUserMedia = SaveUserMediaParams;
