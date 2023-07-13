import { SessionContext } from "../context.js";
import { Routes } from "../index.js";

export async function getFanDetails(context: SessionContext, fanId: string) {
  try {
    const fanDetails = await Routes.V2.Users.fan.get(context, fanId);
    return fanDetails;
  } catch (err) {
    console.error("Failed to get a fan details", err);
  }
}
