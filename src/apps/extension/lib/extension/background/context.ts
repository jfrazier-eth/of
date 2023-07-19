import { Context } from "../../api/context";
import { API_BASE_URL } from "../../constants";

export let context = new Context(API_BASE_URL);

export const updateContext = (newContext: Context) => {
  context = newContext;
};
