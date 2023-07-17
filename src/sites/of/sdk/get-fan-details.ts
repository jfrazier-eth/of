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

export async function getFanStats(context: SessionContext, fanHandle: string) {
  try {
    const fanStats = await Routes.V2.Users.fan.getFanStats(context, fanHandle);
    return fanStats;
  } catch (err) {
    console.error("Failed to get a fan details", err);
  }
}


export async function getNewFans(context: SessionContext, dates: { startDate: string, endDate: string }) {
  try {
    const newFans = await Routes.V2.Users.fan.getNewFans(context, dates);
    return newFans;
  } catch (err) {
    console.error("Failed to get a new fans", err);
  }
}
