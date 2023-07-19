import { ContextOptions } from "@/sites/common/context";
import { Browsers, Context } from "@/sites/common/index";
import { clone } from "@/utils/clone";

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
    return Promise.resolve({
      ...this.browser.headers,
      Authorization: this._userParams.auth,
    });
  }
}
