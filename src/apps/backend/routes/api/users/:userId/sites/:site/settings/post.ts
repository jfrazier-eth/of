import { Request, Response } from "express";

import { userSettingsModel } from "@/backend/models/only-fans/user-settings";

export const post = async (req: Request, res: Response) => {
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
