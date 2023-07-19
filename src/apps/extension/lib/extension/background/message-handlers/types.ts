import { Context } from "@/extension/lib/api/context";
import { Message } from "../../messages/index";
import { MessagesByKind, ResponsesByKind } from "../../messages/mappings";

export type Handler<T extends Message> = (
  msg: MessagesByKind[T["kind"]],
  context: Context
) => Promise<ResponsesByKind[T["kind"]]>;
