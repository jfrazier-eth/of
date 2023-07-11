import { Routes } from "../index.js";
import { getSession } from "./get-session.js";
import {getXbcAndSess} from "./api.js"
import { GetUnreadMessagesOptions } from "../routes/v2/chats/list/types.js";


async function fetchFans(authId: string, session: any, options: GetUnreadMessagesOptions, fans: number[] = []) {
  const listOfChats = await Routes.V2.Chats.List.Get.get(session, options);

  for (const chat of listOfChats.list) {
    if (chat.lastMessage.fromUser.id.toString() !== authId) {
      fans.push(chat.withUser.id);
    }
  }

  if (options.filter === 'unread' && listOfChats.hasMore) {
    options.offset = listOfChats.nextOffset;
    return fetchFans(authId, session, options, fans);
  }

  return fans;
}

export async function getFansToMessage(authId: string, options: GetUnreadMessagesOptions) {
  try { 
    const {xbc, sess} = await getXbcAndSess(authId);   
    if(!xbc || !sess) throw new Error("xbc or sess is null");
    const session = await getSession(xbc, authId, sess);
    const fansIds = await fetchFans(authId, session, options);
    return fansIds;
  } catch (err) {
    console.error("Failed to fetch Fans to message", err);
  }
}
