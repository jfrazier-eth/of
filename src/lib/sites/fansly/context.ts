import { clone } from "@/utils/clone";

import { Context } from "../common";
import { ContextOptions } from "../common/context";

export interface UserFanslyParams {
  userId: string;
  auth: string;
}

export class LoggedInContext extends Context {
  protected _userParams: UserFanslyParams;

  constructor(userParams: UserFanslyParams, options: ContextOptions) {
    super(options);
    this._userParams = clone(userParams);
  }

  public get userId() {
    return this._userParams.userId;
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const browserHeaders = this.browser ? this.browser.headers : {};

    return Promise.resolve({
      ...browserHeaders,
      Authorization: this._userParams.auth,
    });
  }
}