import { clone } from "@/utils/clone";

import { Client, getClient } from "./client/index";
import { ClientOptions } from "./client/types";
import { Browsers } from "./index";

export interface ContextOptions {
  baseUrl: string | URL;
  browser?: Browsers.Browser;
  proxy?: string | URL | null;
}

export class Context {
  protected _baseUrl: URL;

  public get baseUrl() {
    return new URL(this._baseUrl.toString());
  }

  public get browser() {
    return clone(this._browser);
  }

  public get options() {
    return {
      baseUrl: this.baseUrl,
      browser: this.browser,
      proxy: this._proxy,
    };
  }

  public get client() {
    return this._client;
  }

  protected _browser: Browsers.Browser | null;
  protected _proxy: URL | null;
  protected _client: Client;

  constructor(options: ContextOptions) {
    this._baseUrl = new URL(options.baseUrl.toString());
    this._browser = options.browser ?? null;

    const clientOptions: ClientOptions = {
      responseType: "json",
    };

    this._proxy = options.proxy ? new URL(options.proxy) : null;
    if (this._proxy) {
      // clientOptions.httpsAgent = new HttpsProxyAgent(this._proxy, {
      //   keepAlive: true,
      // });
      // clientOptions.rejectUnauthorized = this._proxy.hostname !== "127.0.0.1";
    }

    this._client = getClient(clientOptions);
  }

  public getUrl(path: string, searchParams?: URLSearchParams) {
    const url = this.baseUrl;
    url.pathname = path;
    searchParams?.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    return url;
  }

  public async getHeaders(_url: URL): Promise<Record<string, string>> {
    if (this.browser) {
      return Promise.resolve(this.browser.headers);
    }
    return Promise.resolve({});
  }
}
