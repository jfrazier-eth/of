import { OFWelcomeMessage, PGOFWelcomeMessage } from "./types";

export const transformPGOFWelcomeMessage = (pgMessage: PGOFWelcomeMessage) => {
  const message: OFWelcomeMessage = {
    id: pgMessage.id,
    siteUserId: pgMessage.site_user_id,
    userId: pgMessage.user_id,
    createdAt: pgMessage.created_at.getTime(),
    updatedAt: pgMessage.updated_at.getTime(),
    message: {
      image: pgMessage.image,
      script: pgMessage.script,
      price: pgMessage.price,
    },
  };
  return message;
};

export const transformOFWelcomeMessage = (params: OFWelcomeMessage) => {
  const pgMessage: PGOFWelcomeMessage = {
    id: params.id,
    site_user_id: params.siteUserId,
    user_id: params.userId,
    created_at: new Date(params.createdAt),
    updated_at: new Date(params.updatedAt),
    image: params.message.image,
    script: params.message.script,
    price: params.message.price,
  };
  return pgMessage;
};
