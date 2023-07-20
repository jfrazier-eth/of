import { Context } from "../api/context";
import { postAuth } from "../api/site-auth";
import { Auth } from "./types";

export async function saveAuth(auth: Auth, context: Context) {
  const cachedAuth = await getCachedAuth(auth.xbc);

  if (
    !cachedAuth ||
    auth.xbc !== cachedAuth.xbc ||
    auth.sess !== cachedAuth.sess ||
    auth.authId !== cachedAuth.authId
  ) {
    await updateAuth(auth, context);
  }
}

export async function updateAuth(auth: Auth, context: Context) {
  try {
    await postAuth(context, auth);
    await saveCachedAuth(auth);
    await saveActiveAuth(auth);
    context.ofAuth = auth;
  } catch (err) {
    console.error(err);
  }
}

export async function getCachedAuth(xbc: string): Promise<Auth | null> {
  return new Promise<Auth | null>((resolve) => {
    chrome.storage.local.get(xbc, function (items) {
      if (items[xbc]) {
        try {
          const value = JSON.parse(items[xbc]) as Auth;
          resolve(value);
        } catch (err) {
          chrome.storage.local.remove(xbc, function () {
            resolve(null);
          });
        }
      } else {
        resolve(null);
      }
    });
  });
}

export async function getActiveAuth(): Promise<Auth | null> {
  const key = "active-of-auth";
  return new Promise<Auth | null>((resolve) => {
    chrome.storage.local.get(key, function (items) {
      if (items[key]) {
        try {
          const value = JSON.parse(items[key]) as Auth;
          resolve(value);
        } catch (err) {
          chrome.storage.local.remove(key, function () {
            resolve(null);
          });
        }
      } else {
        resolve(null);
      }
    });
  });
}

export async function saveCachedAuth(auth: Auth): Promise<void> {
  const key = auth.xbc;
  const value = JSON.stringify(auth);
  return new Promise<void>((resolve) => {
    chrome.storage.local.set(
      {
        [key]: value,
      },
      () => {
        resolve();
      }
    );
  });
}

export async function saveActiveAuth(auth: Auth): Promise<void> {
  const key = `active-of-auth`;
  const value = JSON.stringify(auth);
  return new Promise<void>((resolve) => {
    chrome.storage.local.set(
      {
        [key]: value,
      },
      () => {
        resolve();
      }
    );
  });
}
