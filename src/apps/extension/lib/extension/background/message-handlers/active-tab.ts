import { ActiveTabMessage } from "../../messages/index";
import { Handler } from "./types";

export const getActiveTab = async () => {
  const tabs = await new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        resolve(tabs);
      }
    );
  });

  return tabs[0] ?? null;
};

export const handleActiveTabMessage: Handler<ActiveTabMessage> = async (message) => {
  const activeTab = await getActiveTab();

  if (activeTab.id) {
    return {
      kind: "ACTIVE_TAB",
      data: {
        id: activeTab.id,
      },
    };
  }
  return {
    kind: "ACTIVE_TAB",
    data: null,
  };
};
