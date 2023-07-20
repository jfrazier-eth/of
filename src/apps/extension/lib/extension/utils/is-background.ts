export const isBackground = () => {
  if (
    chrome?.extension?.getBackgroundPage &&
    typeof chrome.extension.getBackgroundPage === "function"
  ) {
    return chrome.extension.getBackgroundPage() === window;
  }
  return false;
};
