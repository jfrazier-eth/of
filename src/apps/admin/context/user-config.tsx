import { useEffect, useState } from "react";

const loadCachedData = (key: string): string | null => {
  const cachedValue = localStorage.getItem(key);
  return cachedValue || null;
};

const cacheData = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const useUserConfig = () => {
  const [emojis, setEmojis] = useState("");
  const [customScript, setCustomScript] = useState("");
  const [initialLoadComplete, setInitialLoadCompelte] = useState(false);

  useEffect(() => {
    const emojis = loadCachedData("emojis") || "😈🍆";
    const customScript = loadCachedData("customScript") || "This is a default custom script";
    setEmojis(emojis);
    setCustomScript(customScript);
    setInitialLoadCompelte(true);
  }, [setEmojis, setCustomScript, loadCachedData]);

  useEffect(() => {
    if (!initialLoadComplete) {
      return;
    }
    cacheData("emojis", emojis);
    cacheData("customScript", customScript);
  }, [emojis, cacheData, customScript, initialLoadComplete]);

  return {
    emojis,
    setEmojis,
    customScript,
    setCustomScript,
  }
}
