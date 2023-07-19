import mongoose from "mongoose";

import { connection } from "../../db/mongo.js";

const Schema = mongoose.Schema;

const chatMessageSchema = new Schema(
  {
    role: String,
    content: String,
  },
  { _id: false }
);

const msgHistory = new Schema(
  {
    userId: { type: Number, index: true },
    fanId: Number,
    fanName: String,
    messages: [chatMessageSchema],
    AIResponse: String,
  },
  { timestamps: true }
);

const msgHistoryModel = connection.model("msg_history", msgHistory);

export { msgHistoryModel };
