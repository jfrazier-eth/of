export const getPath = (userIdOfChat: string) => {
  return `/api2/v2/chats/${userIdOfChat}/messages`;
};
