import { postAuth } from "../api/site-auth";
import { Auth } from "./types";
import { Context } from "../api/context";
import { API_BASE_URL } from "../constants";

export async function saveAuth(auth: Auth) {
  const cachedAuth = await getCachedAuth(auth.xbc);

  if (
    !cachedAuth ||
    auth.xbc !== cachedAuth.xbc ||
    auth.sess !== cachedAuth.sess ||
    auth.authId !== cachedAuth.authId
  ) {
    await updateAuth(auth);
  }
}

export async function updateAuth(auth: Auth) {
  const context = new Context(API_BASE_URL);
  try {
    await postAuth(context, auth);
    await saveCachedAuth(auth);
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

export async function saveCachedAuth(auth: Auth): Promise<void> {
  const key = `${auth.authId}:${auth.sess}:${auth.xbc}`;
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
