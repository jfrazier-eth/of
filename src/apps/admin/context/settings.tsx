import { err, ok } from "neverthrow";
import { useContext, useEffect, useState } from "react";

import { PromptSettings } from "@/backend/lib/prompts/prompt-settings/types";
import { GetPromptSettingsResponseBody } from "@/backend/routes/api/admin/prompts/:promptId/settings/types";
import { Data } from "@/extension/context/data";
import { API_BASE_URL } from "@/extension/lib/constants";
import { ChatCompletionRequest } from "@/lib/open-ai/chat-completion";
import { parseError } from "@/utils/parse-error";

import { AdminContext } from "./admin";

// export type PromptSettings = Omit<ChatCompletionRequest, 'messages' | "functions"> & { promptId: string, id: string };

export const getSettings = async (adminPassword: string, promptId: string) => {
  try {
    const url = new URL(`/api/admin/prompts/${promptId}/settings`, API_BASE_URL);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-admin-api-key": adminPassword,
      },
    });

    if (response.status === 200) {
      const body = (await response.json()) as GetPromptSettingsResponseBody;
      return ok(body);
    }
    return err(new Error(`Failed to get prompt settings. Status code: ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

const postSettings = async (adminPassword: string, settings: PromptSettings) => {
  try {
    const url = new URL(`/api/admin/prompts/${settings.promptId}/settings`, API_BASE_URL);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        settings,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-admin-api-key": adminPassword,
      },
    });

    if (response.status === 200) {
      return ok(null);
    }
    return err(new Error(`Failed to post settings. Status code: ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

export const usePromptSettings = (props: { promptId?: string }) => {
  const { admin } = useContext(AdminContext);

  const [settings, setSettings] = useState<Data<PromptSettings>>({ isReady: false });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (props.promptId && admin.isReady && admin.value.isLoggedIn) {
      getSettings(admin.value.password, props.promptId).then((res) => {
        if (isMounted) {
          if (res.isErr()) {
            console.error(res.error);
            return;
          }
          setSettings({ isReady: true, value: res.value.settings });
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [props.promptId, admin]);

  const saveSettings = async (settings: PromptSettings) => {
    if (!admin.isReady || !admin.value.isLoggedIn) {
      console.warn("Admin not logged in");
      return;
    }
    setIsSaving(true);
    const res = await postSettings(admin.value.password, settings);

    if (res.isErr()) {
      alert(res.error);
      setIsSaving(false);
      return;
    }
    setIsSaved(true);
    alert("Saved settings!");
    setIsSaving(false);
  };

  return {
    settings,
    updateSettings: (settings: Partial<PromptSettings>) =>
      setSettings((prev) => {
        if (!prev.isReady) {
          return prev;
        }
        setIsSaved(false);
        return {
          isReady: true,
          value: {
            ...prev.value,
            ...settings,
          },
        };
      }),
    saveSettings,
    isSaving,
    isSaved,
  };
};
