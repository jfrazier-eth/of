import { Context } from "@/lib/api/context";
import { Message } from "../../messages/index.js";
import { MessagesByKind, ResponsesByKind } from "../../messages/mappings.js";

export type Handler<T extends Message> = (
  msg: MessagesByKind[T["kind"]],
  context: Context
) => Promise<ResponsesByKind[T["kind"]]>;
