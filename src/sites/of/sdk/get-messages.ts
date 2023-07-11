import { Routes } from "../index.js";
import { getSession } from "./get-session.js";
import {getXbcAndSess} from "./api.js"
import { GetUnreadMessagesOptions } from "../routes/v2/chats/list/types.js";


export async function getMessages(authId: string, options: GetUnreadMessagesOptions) {
  try { 
      const {xbc, sess} = await getXbcAndSess(authId);   
      if(!xbc || !sess) throw new Error("xbc or sess is null");
      const session = await getSession(xbc, authId, sess );
      const listOfChats = await Routes.V2.Chats.List.Get.get(session, options)
      console.log(listOfChats)
  } catch (err) {
      console.error("Failed to get a user details", err);
  }
}
