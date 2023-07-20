import { clone } from "@/utils/clone";

import { Auth } from "../auth/types";
import { MessageHandlers } from "../extension/background/message-handlers";
import { Handler } from "../extension/background/message-handlers/types";
import { Message } from "../extension/messages";
import { MessagesByKind, ResponsesByKind } from "../extension/messages/mappings";
import { sendMessage } from "../extension/messages/send-message";
import { isBackground } from "../extension/utils/is-background";

export class Context {
  protected _baseUrl: URL;

  protected _user: { apiKey: string; userId: string } | null;

  protected _ofAuth: Auth | null;

  public get baseUrl(): URL {
    return new URL(this._baseUrl.toString());
  }

  public isReady: Promise<void>;

  public get user() {
    return this._user;
  }

  public get ofAuth() {
    return this._ofAuth;
  }

  public set user(value: { apiKey: string; userId: string } | null) {
    this._user = clone(value);
  }

  public set ofAuth(value: Auth | null) {
    console.log(`User OF AUth changed`, value);
    this._ofAuth = clone(value);
  }

  constructor(baseUrl: string | URL) {
    this._baseUrl = new URL(baseUrl);
    this._user = null;
    this._ofAuth = null;
    this.isReady = this._init();
  }

  protected async _init() {
    try {
      const response = await sendMessage({ kind: "ACTIVE_USER_INFO" });
      if (response.data.isLoggedIn) {
        this.user = {
          userId: response.data.userId,
          apiKey: response.data.apiKey,
        };
        if (response.data.of.auth) {
          this.ofAuth = response.data.of.auth;
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

  sendMessage = async <T extends Message>(msg: T) => {
    if (!chrome.runtime) {
      throw new Error("No chrome runtime");
    }

    if (isBackground()) {
      type Msg = typeof msg;
      const handler = (MessageHandlers[msg.kind] as unknown) as Handler<Msg>;
      const response = await handler((msg as unknown) as MessagesByKind[Msg["kind"]], this);
      return response;
    } else {
      return await new Promise<ResponsesByKind[T["kind"]]>((resolve, reject) => {
        chrome.runtime.sendMessage(msg, (response) => {
          resolve(response);
        });
      });
    }
  };
}
