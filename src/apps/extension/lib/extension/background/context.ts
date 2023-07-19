import { Context } from "../../api/context.js";
import { API_BASE_URL } from "../../constants.js";

export let context = new Context(API_BASE_URL);

export const updateContext = (newContext: Context) => {
  context = newContext;
};
