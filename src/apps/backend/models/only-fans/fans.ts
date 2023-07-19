import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    role: String,
    content: String,
    message_date: Date,
    message_id: String,
  },
  { _id: false }
);

const tipsHistorySchema = new Schema(
  {
    type: String,
    value: Number,
  },
  { _id: false }
);

const sentMediaSchema = new Schema(
  {
    type: String,
    id: Number,
  },
  { _id: false }
);

const fansSchema = new Schema(
  {
    fan_id: { type: Number, index: true },
    creator_id: { type: Number, index: true },
    messageHistory: [messageSchema],
    tipsHistory: [tipsHistorySchema],
    notes: String,
    preferences: String,
    sentMedia: [sentMediaSchema],
    meta: {
      connected_at: Date,
      status: String,
      fan_type: String,
      // we will add more fields as needed
    },
  },
  { timestamps: true }
);

const FansModel = mongoose.model("Fans", fansSchema);

export { FansModel };
