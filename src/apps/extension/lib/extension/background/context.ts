import { Context } from "@/lib/api/context";
import { API_BASE_URL } from "@/lib/constants";

export let context = new Context(API_BASE_URL);

export const updateContext = (newContext: Context) => {
  context = newContext;
};
