import { Browser } from "./browser";
import { clone } from "./utils/clone";
import * as crypto from "crypto";
import { getOFDynamicParams } from "./utils/of-dynamic-params";

export class Context {
  protected _baseUrl: URL;

  public get baseUrl() {
    return new URL(this._baseUrl.toString());
  }

  public get browser() {
    return clone(this._browser);
  }

  protected _browser: Browser;

  constructor(baseUrl: string | URL, browser: Browser) {
    this._baseUrl = new URL(baseUrl.toString());
    this._browser = browser;
  }

  public getUrl(path: string) {
    const url = this.baseUrl;
    url.pathname = path;
    return url;
  }

  public async getHeaders(_url: URL): Promise<Record<string, string>> {
    return Promise.resolve(this.browser.headers);
  }
}

export interface UserOFParams {
  xbc: string;
}

export class LoggedInContext extends Context {
  protected _userParams: UserOFParams;

  constructor(
    baseUrl: string | URL,
    browser: Browser,
    userParams: UserOFParams
  ) {
    super(baseUrl, browser);
    this._userParams = clone(userParams);
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const { sign, time, appToken } = await this.getDynamicHeaders(url);
    return {
      ...this.browser.headers,
      Sign: sign,
      Time: `${time}`,
      "X-Bc": this._userParams.xbc,
      "App-Token": appToken,
    };
  }

  protected async getDynamicHeaders(url: URL) {
    const time = new Date().getTime();

    const {
      start,
      end,
      appToken,
      checksumIndexes,
      checksumConstant,
      staticParam,
    } = await getOFDynamicParams(this);

    // TODO get user id using the `me` endpoint
    const userId = "";
    const msg = [staticParam, time, url.pathname, userId].join("\n");

    const hexHash = crypto.createHash("sha1").update(msg).digest("hex");
    const asciiHash = Buffer.from(hexHash, "ascii");

    const checksum =
      checksumIndexes.reduce((sum, index) => sum + asciiHash[index], 0) +
      checksumConstant;
    const sign = [start, hexHash, Math.abs(checksum).toString(16), end].join(
      ":"
    );

    return {
      sign,
      time,
      appToken,
    };
  }
}
