import { clone } from "@/utils/clone.js";
import { Browsers } from "./index.js";

export class Context {
  protected _baseUrl: URL;

  public get baseUrl() {
    return new URL(this._baseUrl.toString());
  }

  public get browser() {
    return clone(this._browser);
  }

  protected _browser: Browsers.Browser;

  constructor(baseUrl: string | URL, browser: Browsers.Browser) {
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
