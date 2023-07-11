import { Routes } from "../index.js";
import { getSession } from "./get-session.js";
import {getXbcAndSess} from "./api.js"

export async function getFanMessages(authId: string, fanId: string, options: { otherUserId: string, id?: string } = { otherUserId: fanId }, messageHistory: any[] = []) {
  try { 
    const {xbc, sess} = await getXbcAndSess(authId);   
    if(!xbc || !sess) throw new Error("xbc or sess is null");
    const session = await getSession(xbc, authId, sess);
    const messages = await Routes.V2.Chats.User.Messages.Get.get(session, options);
  
    const newMessages = messages.list.map(message => {
      return {
        "role": message.fromUser.id.toString() === authId ? "creator" : "fan",
        "content": message.text,
        "timeOfMsg": message.createdAt,
        "mediaSent": message.media.length > 0
      };
    });
    messageHistory = messageHistory.concat(newMessages);
  
    if(messageHistory.length < 10 && messages.hasMore) {
      options.id = messages.list[messages.list.length - 1].id.toString();
      return getFanMessages(authId, fanId, options, messageHistory);
    }
    return messageHistory;
  
  } catch (err) {
    console.error("Failed to get messages from a fan", err);
  }
}
