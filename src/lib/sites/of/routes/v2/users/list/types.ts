export interface ListUserItem {
  view: "cl";
  avatar: string;
  id: number;
  name: string;
  username: string;
  canLookStory: boolean;
  hasNotViewedStory: boolean;
  hasStories: boolean;
  hasStream: boolean;
  isVerified: boolean;
  canCommentStory: boolean;
  canEarn: boolean;
  canPayInternal: boolean;
  isPerformer: boolean;
  isRealPerformer: boolean;
  canTrialSend: boolean;
  isBlocked: boolean;
  isRestricted: boolean;
  displayName: string;
  subscribedOn: boolean;
  subscribedOnExpiredNow: boolean;
}

/**
 * A record of the user id to the user's data
 */
export type GetUsersResponseBody = Record<string, ListUserItem>;
