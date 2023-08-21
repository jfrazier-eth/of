import { FullPrompt } from "@/backend/lib/prompts/types";

import { Prompt } from "./Prompt";

export const PromptsList = ({
  prompts,
  updatePrompt,
  savePrompt,
  isSaving,
}: {
  prompts: FullPrompt[];
  updatePrompt: (prompt: FullPrompt) => void;
  savePrompt: (prompt: FullPrompt) => void;
  isSaving: boolean;
}) => {
  return (
    <div style={{ maxWidth: "700px" }}>
      {prompts
        .sort((a, b) => {
          return a.version - b.version;
        })
        .map((prompt) => {
          return (
            <div
              key={prompt.id}
              style={{
                padding: "4px",
              }}
            >
              <h3>Prompt: {prompt.id}</h3>
              <Prompt
                prompt={prompt}
                savePrompt={savePrompt}
                updatePrompt={updatePrompt}
                isSaving={isSaving}
              />
            </div>
          );
        })}
    </div>
  );
};
