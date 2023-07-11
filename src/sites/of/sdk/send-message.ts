import { Routes, SessionContext } from "../index.js";

export async function sendMessage(
  context: SessionContext,
  toUserId: string,
  message: string
) {
  try {
    const response = await Routes.V2.Chats.User.Messages.Post.post(context, {
      toUserId: toUserId,
      text: message,
    });
    return response.id;
  } catch (err) {
    console.error("Failed to send message to a fan", err);
  }
}
