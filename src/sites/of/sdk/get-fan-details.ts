import { SessionContext } from "../context.js";
import { Routes } from "../index.js";

export async function getFanHandle(context: SessionContext, fanId: string) {
  try {
    const fanDetails = await Routes.V2.Users.fan.getFanHandle(context, fanId);
    return fanDetails;
  } catch (err) {
    console.error("Failed to get a fan details", err);
  }
}

export async function getFanStats(context: SessionContext, fanId: string) {
  try {
    const fanStats = await Routes.V2.Users.fan.getFanStats(context, fanId);
    return fanStats;
  } catch (err) {
    console.error("Failed to get a fan details", err);
  }
}