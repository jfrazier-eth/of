import { Context } from "@/extension/lib/api/context";
import { ClientErrors } from "@/sites/common/client";
import { Result } from "neverthrow";

import { Message } from "../../messages/index";
import { MessagesByKind, ResponsesByKind } from "../../messages/mappings";

export type HandlerError = ClientErrors | Error;

export type Handler<T extends Message> = (
  msg: MessagesByKind[T["kind"]],
  context: Context
) => Promise<Result<ResponsesByKind[T["kind"]], HandlerError>>;
