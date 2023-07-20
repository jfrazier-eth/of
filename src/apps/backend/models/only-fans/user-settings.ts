import mongoose from "mongoose";

import { connection } from "../../db/mongo";

const Schema = mongoose.Schema;

const userSettings = new Schema(
  {
    userId: { type: String, index: true },
    autoMessages: Boolean,
    welcomeMessageDefault: Boolean,
    spendingThreshold: Number,
    scripts: String,
    welcomeMessage: String,
    welcomePrice: Number,
    ppvPrice1: Number,
    ppvPrice2: Number,
    selectedImage: String,
    ppvDefault1: String,
    ppvDefault2: String,
    favoriteEmojis: String,
  },
  { timestamps: true }
);

const userSettingsModel = connection.model("user_settings", userSettings);

export { userSettingsModel };