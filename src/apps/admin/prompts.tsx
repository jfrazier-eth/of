import { useContext } from "react";

import { FullPrompt } from "@/backend/lib/prompts/types";
import { uid } from "@/utils/uid";

import { PromptsList } from "./components/prompts/PromptList";
import { PromptContext } from "./context/prompts";

export const Prompts = () => {
  const { prompts, savePrompt, updatePrompt, isSaving } = useContext(PromptContext);

  const createPrompt = () => {
    if (!prompts.isReady) {
      return;
    }

    const maxVersion = prompts.value.reduce((acc, item) => {
      return item.version > acc ? item.version : acc;
    }, 0);
    const prompt: FullPrompt = {
      id: uid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: maxVersion === 0,
      messages: [],
      version: maxVersion + 1,
    };
    updatePrompt(prompt);
  };

  return (
    <div>
      <h2>Prompts</h2>
      <div>
        Instructions:
        <ol>
          <li>Create a prompt.</li>
          <li>
            Add messages to the prompt, and utilize <strong>{"{emojis}"}</strong> and{" "}
            <strong>{"{customScript}"}</strong> to inject the user's emoji and custom script
            settings into a message.
          </li>
          <li>Preview the message to see what the message will look like when sent to the AI.</li>
          <li>Save the prompt.</li>
          <li>Activate the prompt to begin using it in production.</li>
        </ol>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createPrompt();
        }}
      >
        New Prompt
      </button>
      {prompts.isReady ? (
        <PromptsList
          isSaving={isSaving}
          savePrompt={savePrompt}
          prompts={prompts.value}
          updatePrompt={updatePrompt}
        />
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};
