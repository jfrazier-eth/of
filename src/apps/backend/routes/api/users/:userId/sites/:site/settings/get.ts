import { Request, Response } from "express";

import { userSettingsModel } from "@/backend/models/only-fans/user-settings";

export const get = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  try {
    // TODO get settings
    const settings = await userSettingsModel.findOne({ userId: userId });

    if (!settings) {
      return res.status(200).json({
        userId: userId,
        autoMessages: false,
        welcomeMessageDefault: false,
        spendingThreshold: 0,
        scripts: "",
        welcomeMessage: "",
        welcomePrice: 0,
        ppvPrice1: 0,
        ppvPrice2: 0,
        selectedImage: "",
        ppvDefault1: "",
        ppvDefault2: "",
        favoriteEmojis: "",
      });
    }
    return res.status(200).json(settings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "DB is down" });
  }
};
