export const getString = (key: string) => {
  return new Promise<string | null>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      try {
        const value = result[key];
        if (value) {
          resolve(value);
        } else {
          resolve(null);
        }
      } catch (err) {
        resolve(null);
      }
    });
  });
};

export const getObject = async <T>(key: string) => {
  try {
    const str = await getString(key);

    if (!str) {
      return null;
    }
    const obj = JSON.parse(str) as T;

    return obj;
  } catch (err) {
    return null;
  }
};
