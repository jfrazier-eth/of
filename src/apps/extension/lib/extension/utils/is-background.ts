export const isBackground = () => {
  if (!chrome?.extension?.getBackgroundPage) {
    return true; // service worker
  } else if (typeof chrome.extension.getBackgroundPage === "function") {
    return chrome.extension.getBackgroundPage() === window;
  }
  return false;
};
