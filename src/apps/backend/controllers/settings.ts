import { Request, Response } from "express";

import { userSettingsModel } from "../models/only-fans/user-settings.js";

export const getSettings = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  try {
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

export const postSettings = async (req: Request, res: Response) => {
  const { userId, ...settings } = req.body;
  try {
    let userSettings = await userSettingsModel.findOne({ userId: userId });

    if (userSettings) {
      userSettings = await userSettingsModel.findByIdAndUpdate(userSettings._id, settings, {
        new: true,
      });
    } else {
      userSettings = await userSettingsModel.create({ userId: userId, ...settings });
    }

    return res.status(200).json(userSettings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "DB is down" });
  }
};