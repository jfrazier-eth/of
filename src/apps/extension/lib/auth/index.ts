import { Context } from "../api/context";
import { postAuth } from "../api/site-auth";
import { Storage } from "../extension/storage";
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
  const auth = await Storage.getObject<Auth>(xbc);
  return auth;
}

export async function getActiveAuth(): Promise<Auth | null> {
  const key = "active-of-auth";
  const auth = await Storage.getObject<Auth>(key);
  return auth;
}

export async function saveCachedAuth(auth: Auth): Promise<void> {
  const key = auth.xbc;
  await Storage.set({
    [key]: auth,
  });
}

export async function saveActiveAuth(auth: Auth): Promise<void> {
  const key = `active-of-auth`;

  await Storage.set({
    [key]: auth,
  });
}
