export const set = async (object: { [key: string]: string | object }): Promise<void> => {
  try {
    const storedValues = Object.fromEntries(
      Object.entries(object).map((item) => {
        const [key, value] = item;
        if (typeof value === "string") {
          return [key, value];
        }
        return [key, JSON.stringify(value)];
      })
    );
    await new Promise<void>((resolve) => {
      chrome.storage.local.set(storedValues, resolve);
    });
  } catch (err) {
    throw err;
  }
};
