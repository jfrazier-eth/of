import { err, ok } from "neverthrow";
import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

import { FullPrompt } from "@/backend/lib/prompts/types";
import { GetPromptsResponseBody } from "@/backend/routes/api/admin/prompts/types";
import { Data } from "@/extension/context/data";
import { API_BASE_URL } from "@/extension/lib/constants";
import { parseError } from "@/utils/parse-error";

import { AdminContext } from "./admin";

interface PromptContextValue {
  prompts: Data<FullPrompt[]>;
  isSaving: boolean;
  savePrompt: (prompt: FullPrompt) => void;
  updatePrompt: (prompt: FullPrompt) => void;
}

export const PromptContext = createContext<PromptContextValue>({
  prompts: { isReady: false },
  isSaving: false,
  savePrompt: () => {},
  updatePrompt: () => {},
});

const getPrompts = async (adminPassword: string) => {
  try {
    const url = new URL("/api/admin/prompts", API_BASE_URL);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-admin-api-key": adminPassword,
      },
    });

    if (response.status === 200) {
      const body = (await response.json()) as GetPromptsResponseBody;
      return ok(body);
    }
    return err(new Error(`Failed to get prompts. Status code: ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

const postPrompt = async (adminPassword: string, prompt: FullPrompt) => {
  try {
    const url = new URL("/api/admin/prompts", API_BASE_URL);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        prompt,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-admin-api-key": adminPassword,
      },
    });

    if (response.status === 200) {
      return ok(null);
    }
    return err(new Error(`Failed to post prompt. Status code: ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

export const PromptContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<PromptContextValue["prompts"]>({
    isReady: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const { admin } = useContext(AdminContext);

  useEffect(() => {
    let isMounted = true;
    if (!prompts.isReady && admin.isReady) {
      const { isLoggedIn } = admin.value;
      if (isLoggedIn) {
        getPrompts(admin.value.password).then((res) => {
          if (isMounted) {
            if (res.isErr()) {
              console.error(res.error);
            } else {
              const { prompts } = res.value;

              setPrompts({
                isReady: true,
                value: prompts,
              });
            }
          }
        });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [admin, prompts, getPrompts]);

  const savePrompt = async (prompt: FullPrompt) => {
    if (!admin.isReady || !admin.value.isLoggedIn) {
      console.warn("Admin not logged in");
      return;
    }
    setIsSaving(true);

    const res = await postPrompt(admin.value.password, prompt);
    if (res.isErr()) {
      alert(res.error);
      setIsSaving(false);
      return;
    }

    alert("Saved!");
    setIsSaving(false);
  };

  const updatePrompt = (prompt: FullPrompt) => {
    setPrompts((prev) => {
      if (!prev.isReady) {
        return prev;
      }
      const { value } = prev;
      const index = value.findIndex((p) => p.id === prompt.id);
      if (prompt.isActive) {
        for (const item of value) {
          if (item.isActive) {
            item.isActive = false;
          }
        }
      }

      if (index === -1) {
        return { ...prev, value: [...value, prompt] };
      }

      let updated = [...value];
      updated[index] = prompt;
      return {
        ...prev,
        value: updated,
      };
    });
  };

  return (
    <PromptContext.Provider
      value={{
        prompts,
        isSaving,
        savePrompt,
        updatePrompt,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};
