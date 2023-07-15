export const getUsers = async (options: {
  hasAutomaticMessagesEnabled?: boolean;
}) => {
  /**
   * find all users that have enabled automatic messages
   *
   * //TODO update this to support filtering by the automatic messages setting
   */
  const users = await FansModel.find({});

  return users;
};
