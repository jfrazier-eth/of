import { err, ok } from "neverthrow";
import { useContext, useEffect, useState } from "react";

import { FullPrompt, PromptMessage } from "@/backend/lib/prompts";
import { PromptSettings } from "@/backend/lib/prompts/prompt-settings";
import { transformPrompt } from "@/backend/routes/api/ai/chat/transform-request-v2";
import { AIChatRequestBody, AIChatResponseBody } from "@/backend/routes/api/ai/chat/types";
import { Data } from "@/extension/context/data";
import { API_BASE_URL } from "@/extension/lib/constants";
import { parseError } from "@/utils/parse-error";

import { AdminContext } from "./admin";

const loadCachedData = (key: string): string | null => {
  const cachedValue = localStorage.getItem(key);
  return cachedValue || null;
};

const cacheData = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

interface GenerateResponseOptions {
  promptId: string;
  messages: { fromUserId: string; content: string }[];
  emojis: string;
  customScript: string;
}

const FAN = {
  name: "Kevin",
  id: "user2",
};

const CREATOR = {
  name: "Nicole",
  id: "user1",
};

const generateResponse = async (adminPassword: string, options: GenerateResponseOptions) => {
  try {
    const body: AIChatRequestBody = {
      promptId: options.promptId,
      user: CREATOR,
      withUser: FAN,
      messages: options.messages,
      emojis: options.emojis,
      customScript: options.customScript,
    };

    const url = new URL("/api/ai/chat", API_BASE_URL);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": adminPassword,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const body = (await response.json()) as AIChatResponseBody;
      return ok(body);
    }

    return err(new Error(`Failed to generate response, Status code ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

export const useChat = ({ prompt, settings }: { prompt?: FullPrompt; settings?: PromptSettings }) => {
  const { admin } = useContext(AdminContext);
  const [promptMessages, setPromptMessages] = useState<
    Data<{ content: string; role: PromptMessage["role"] }[]>
  >({ isReady: false });
  const [chat, setChat] = useState<Data<{ content: string; user: typeof FAN | typeof CREATOR }[]>>({
    isReady: true,
    value: []
  });
  const [emojis, setEmojis] = useState("");
  const [customScript, setCustomScript] = useState("");
  const [initialLoadComplete, setInitialLoadCompelte] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [messages, setMessages] = useState<
    Data<{ content: string; user: typeof FAN | typeof CREATOR | "system" }[]>
  >({ isReady: false });

  useEffect(() => {
    if (!chat.isReady || !promptMessages.isReady) {
      return;
    }
    const prompt = promptMessages.value.map((item) => {
      switch (item.role) {
        case "system":
          return {
            content: item.content,
            user: "system",
          };
        case "user": {
          return {
            content: item.content,
            user: FAN,
          };
        }
        case "assistant": {
          return {
            content: item.content,
            user: CREATOR,
          };
        }
      }
    }) as { content: string; user: typeof FAN | typeof CREATOR | "system" }[];

    setMessages({ isReady: true, value: [...prompt, ...chat.value] });
  }, [chat, promptMessages, setMessages]);

  useEffect(() => {
    const emojis = loadCachedData("emojis") || "";
    const customScript = loadCachedData("customScript") || "";
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

  useEffect(() => {
    if (!prompt || !initialLoadComplete) {
      return;
    }
    const { messages: promptMessages } = transformPrompt(prompt, {
      emojis,
      customScript,
      messages: [],
    });
    setPromptMessages({ isReady: true, value: promptMessages });
  }, [prompt, transformPrompt, emojis, customScript, initialLoadComplete]);

  const respond = async () => {
    if (!admin.isReady || !admin.value.isLoggedIn) {
      console.warn("Admin not logged in");
      return;
    }
    if (!prompt || !settings || !chat.isReady) {
      console.warn("Prompt or settings not ready");
      return;
    }

    const options: GenerateResponseOptions = {
      promptId: prompt.id,
      messages: chat.value.map((msg) => {
        return {
          fromUserId: msg.user.id,
          content: msg.content,
        }
      }),
      emojis,
      customScript,
    };
    setIsGenerating(true);
    const response = await generateResponse(admin.value.password, options);
    if (response.isErr()) {
      console.error(response.error);
      return;
    }

    const message = response.value.message;

    addMessage(CREATOR, message);
    setIsGenerating(false);
  };

  const addMessage = (user: typeof CREATOR | typeof FAN, content: string) => {
    setChat((prev) => {
      if (!prev.isReady) {
        return prev;
      }

      return {
        isReady: true,
        value: [
          ...prev.value,
          {
            user,
            content,
          },
        ],
      };
    });
  };

  return {
    emojis,
    customScript,
    setEmojis,
    setCustomScript,
    messages,
    isGenerating,
    addMessage,
    respond,
    FAN, CREATOR
  };
};
