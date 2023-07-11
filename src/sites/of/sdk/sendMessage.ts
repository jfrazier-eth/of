import { Routes } from "../index.js";
import { getSession } from "./get-session.js";
import {getXbcAndSess} from "./api.js"

export async function sendMessage(authId:string, fanId:string, message:string) {
  try { 
    const {xbc, sess} = await getXbcAndSess(authId);   
    if(!xbc || !sess) throw new Error("xbc or sess is null");
    const session = await getSession(xbc, authId, sess);
    const response = await Routes.V2.Chats.User.Messages.Post.post(session, {
        toUserId: fanId,
        text: message,
    });
    return response.id;
  
  } catch (err) {
    console.error("Failed to send message to a fan", err);
  }
}
