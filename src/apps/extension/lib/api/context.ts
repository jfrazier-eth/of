import { clone } from "@/utils/clone";

import { Auth } from "../auth/types";
import { API_BASE_URL } from "../constants";
import { getActiveUserInfo } from "../extension/background/message-handlers/user-info";

import { BrowserOFParamsHandler } from "./of-params-handler";

export class Context {
  protected _baseUrl: URL;

  protected _user: { apiKey: string; userId: string } | null;

  protected _ofAuth: Auth | null;

  protected static instance: Context;
  static getInstance() {
    if (!Context.instance) {
      Context.instance = new Context(API_BASE_URL);
    }
    return Context.instance;
  }

  public get baseUrl(): URL {
    return new URL(this._baseUrl.toString());
  }

  public _isInitialized: Promise<void>;
  public isReady: Promise<unknown>;

  public get user() {
    return this._user;
  }

  public get ofAuth() {
    return this._ofAuth;
  }

  public set user(value: { apiKey: string; userId: string } | null) {
    if (!this._user) {
      this.ofParams.refresh();
    }
    this._user = clone(value);
  }

  public set ofAuth(value: Auth | null) {
    this._ofAuth = clone(value);
  }

  public ofParams: BrowserOFParamsHandler;

  constructor(baseUrl: string | URL) {
    this._baseUrl = new URL(baseUrl);
    this._user = null;
    this._ofAuth = null;
    this.ofParams = new BrowserOFParamsHandler(this, null);
    this._isInitialized = this._init();
    this.isReady = Promise.all([this._isInitialized, this.ofParams.isReady]);
  }

  protected async _init() {
    try {
      const response = await getActiveUserInfo();
      if (response.isErr()) {
        throw response.error;
      }
      if (response.value.data.isLoggedIn) {
        this.user = {
          userId: response.value.data.userId,
          apiKey: response.value.data.apiKey,
        };
        if (response.value.data.of.auth) {
          this.ofAuth = response.value.data.of.auth;
        }
      }
      console.warn("No active user");
    } catch (err) {
      console.error(err);
    }
  }

  public getUrl(path: string, searchParams?: URLSearchParams) {
    const url = this.baseUrl;
    url.pathname = path;
    searchParams?.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url;
  }

  public getHeaders(): Record<string, string> {
    if (this.user) {
      return {
        "x-api-key": this.user.apiKey,
        "x-user-id": this.user.userId,
      };
    }
    return {};
  }
}
