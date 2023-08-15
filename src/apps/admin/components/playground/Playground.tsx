import { Data } from "@/extension/context/data";

import { useChat } from "../../context/chat";
import { useActivePrompt } from "../../context/prompts";
import { usePromptSettings } from "../../context/settings";
import { NewMessage } from "./NewMessage";

function extractValue<T>(item: Data<T>): T | undefined {
  if (item.isReady) {
    return item.value;
  }
  return undefined;
}

export const Playground = () => {

  const { prompt } = useActivePrompt();
  const promptId = extractValue(prompt)?.id;
  const extractedPrompt = extractValue(prompt);

  const { settings } = usePromptSettings({ promptId: promptId });
  const extractedSettings = extractValue(settings);
  const {
    messages,
    emojis,
    customScript,
    setEmojis,
    setCustomScript,
    isGenerating,
    respond,
    addMessage,
    FAN,
    CREATOR
  } = useChat({ prompt: extractedPrompt, settings: extractedSettings });

  if (!prompt.isReady || !settings.isReady || !messages.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      display: "relative",
      maxWidth: "700px"
    }}>
      <h1>Playground</h1>
      <label style={{ paddingRight: '4px' }}>Emojis</label>
      <input type="text" value={emojis} onChange={(e) => setEmojis(e.target.value)}></input>

      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        <label>Custom Script</label>
        <textarea
          value={customScript}
          onChange={(e) => setCustomScript(e.target.value)}
        ></textarea>
      </div>

      {messages.value.map((msg, index) => {
        return (
          <div key={index.toString()} style={{
            padding: "1rem"
          }}>
            <p style={{ color: "blue" }}>
              {typeof msg.user === "string" ? msg.user : msg.user.name}
            </p>{" "}
            {msg.content}
          </div>
        );
      })}
      <NewMessage CREATOR={CREATOR} FAN={FAN} saveMessage={addMessage} />
      <button
        style={{
          marginTop: "4px"
        }}
        disabled={isGenerating}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          respond();
        }}
      >
        Generate Response
      </button>
    </div>
  );
};
