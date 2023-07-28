import { UserSettings } from "../lib/extension/background/message-handlers/user-settings";
import { sendMessage } from "../lib/extension/messages/index";

function blurImages(
  images: HTMLCollectionOf<HTMLImageElement> | HTMLImageElement[],
  blurRadiusRem: number
) {
  for (let i = 0; i < images.length; i++) {
    images[i].style.filter = `blur(${blurRadiusRem}rem)`;
  }
}

function blueVideos(
  videos: HTMLCollectionOf<HTMLVideoElement> | HTMLVideoElement[],
  blurRadiusRem: number
) {
  for (let i = 0; i < videos.length; i++) {
    videos[i].style.filter = `blur(${blurRadiusRem}rem)`;
  }
}

function blurVideoCovers(
  div: HTMLCollectionOf<HTMLDivElement> | HTMLDivElement[],
  blurRadiusRem: number
) {
  for (let i = 0; i < div.length; i++) {
    div[i].style.filter = `blur(${blurRadiusRem}rem)`;
  }
}

const handleMutations = (settings: UserSettings["incognito"]): MutationCallback => (mutations) => {
  if (settings.text.blur) {
    walk(document.body, settings.text);
  }
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === "IMG" && settings.images.blur) {
          blurImages([node as HTMLImageElement], settings.images.blurRadiusRem);
        } else if (node.nodeName === "VIDEO" && settings.videos.blur) {
          blueVideos([node as HTMLVideoElement], settings.videos.blurRadiusRem);
        } else if (
          "getElementsByTagName" in node &&
          node.getElementsByTagName &&
          typeof node.getElementsByTagName === "function"
        ) {
          if (settings.images.blur) {
            const images = node.getElementsByTagName("img");
            blurImages(images, settings.images.blurRadiusRem);
          }
          if (settings.videos.blur) {
            const videos = node.getElementsByTagName("video");
            blueVideos(videos, settings.videos.blurRadiusRem);
          }
        }

        if (
          "getElementsByClassName" in node &&
          node.getElementsByClassName &&
          typeof node.getElementsByClassName === "function" &&
          settings.videos.blur
        ) {
          const videoCovers = (node as HTMLDivElement).getElementsByClassName("blurred-poster");
          blurVideoCovers(
            videoCovers as HTMLCollectionOf<HTMLDivElement>,
            settings.videos.blurRadiusRem
          );
        }
      });
    }
  });
};

type DomNode = ChildNode &
  ParentNode & {
    nodeType: number;
    nodeValue: string | null;
    firstChild: DomNode;
    nextSibling: DomNode;
  };

function handleText(
  textNode: DomNode | HTMLElement,
  textSettings: UserSettings["incognito"]["text"]
) {
  const parent = textNode.parentElement;
  if (textSettings.blur && parent) {
    parent.classList.add("seductiveBlurred");
    if (textSettings.unBlurOnHover) {
      parent.classList.add("seductiveUnBlurred");
    }
  } else if (textSettings.blur) {
    console.warn("No style property in parent of textNode");
  }
}

function walk(node: any, textSettings: UserSettings["incognito"]["text"]) {
  let child, next;
  switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, textSettings);
        child = next;
      }
      break;
    case 3: // Text node
      handleText(node, textSettings);
      break;
  }
}

sendMessage({
  kind: "USER_SETTINGS",
})
  .then((res) => {
    if (res.isErr()) {
      console.error(`Failed to get user settings`, res.error);
      return;
    }
    const settingsResponse = res.value;
    if (settingsResponse.data.incognito.images.blur) {
      const initialImages = document.getElementsByTagName("img");
      blurImages(initialImages, settingsResponse.data.incognito.images.blurRadiusRem);
    }
    if (settingsResponse.data.incognito.videos.blur) {
      const initialVideos = document.getElementsByTagName("video");
      blueVideos(initialVideos, settingsResponse.data.incognito.videos.blurRadiusRem);
    }

    walk(document.body, settingsResponse.data.incognito.text);
    const observer = new MutationObserver(handleMutations(settingsResponse.data.incognito));
    observer.observe(document.body, { childList: true, subtree: true });
  })
  .catch((err) => {
    console.error("Failed to load user settings.", err);
  });

function setNativeValue(element: Element, value: string) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, "value") || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, "value") || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    throw new Error("The given element does not have a value setter");
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
}

function addButton(uid: string) {
  const buttonId = "generate-button";
  const buttonElement = document.getElementById(buttonId);
  if (buttonElement) {
    // Button already exists
    return;
  }

  const textarea = document.querySelector("#new_post_text_input");
  if (!textarea) return;

  const button = document.createElement("button");
  button.id = buttonId;
  button.classList.add("generate-button");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    button.disabled = true;

    sendMessage({
      kind: "GENERATE_RESPONSE",
      data: {
        chat: {
          withUser: {
            id: uid,
          },
        },
      },
    })
      .then((response) => {
        if (response.isErr()) {
          console.error(`Failed to generate response`, response.error);
          return;
        }
        const textarea = document.querySelector("#new_post_text_input");
        if (textarea) {
          setNativeValue(textarea, response.value.data.message);
        } else {
          console.error("Failed to find textarea");
        }

        button.disabled = false;
      })
      .catch((err) => {
        console.error(err);
        button.disabled = false;
      });
  });

  const image = document.createElement("img");
  image.src = chrome.runtime.getURL("generate.svg");
  image.classList.add("generate-button-img");
  image.alt = "Generate";

  const parentElement = textarea.parentElement;
  if (parentElement) {
    parentElement.appendChild(button);
    button.appendChild(image);
  }
}

function observeDOM(uid: string) {
  const targetNode = document.querySelector("body");

  if (targetNode) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          addButton(uid);
        }
      }
    });

    const observerConfig = { childList: true, subtree: true };
    observer.observe(targetNode, observerConfig);
  }
}

function extractUid(url: string): { matches: false } | { matches: true; uid: string } {
  const pattern = /my\/chats\/chat\/(\d+)/;
  const items = url.match(pattern);
  if (!items) {
    return {
      matches: false,
    };
  }

  const uid = items[1];
  if (typeof uid === "string") {
    return {
      matches: true,
      uid,
    };
  }
  return {
    matches: false,
  };
}

const result = extractUid(window.location.href);

if (result.matches) {
  if (document.readyState === "complete") {
    addButton(result.uid);
  } else {
    document.addEventListener("DOMContentLoaded", () => addButton(result.uid));
  }
  observeDOM(result.uid);
}
