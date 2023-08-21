import { PromptSettings } from "@/backend/lib/prompts/prompt-settings/types";

import { usePromptSettings } from "../../context/settings";

const Settings = (props: { promptId: string }) => {
  const { settings, saveSettings, updateSettings, isSaving, isSaved } = usePromptSettings({
    promptId: props.promptId,
  });

  if (!settings.isReady) {
    return (
      <div>
        <h3>Prompt Settings</h3>
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div
      style={{
        maxWidth: "700px",
      }}
    >
      <h3>Prompt Settings</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label style={{ marginTop: "4px" }}>Model</label>
        <select
          value={settings.value.model}
          onChange={(e) => {
            updateSettings({ model: e.target.value as PromptSettings["model"] });
          }}
        >
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
        </select>

        <label style={{ marginTop: "4px" }}>
          Temperature - What sampling temperature to use, between 0 and 2. Higher values like 0.8
          will make the output more random, while lower values like 0.2 will make it more focused
          and deterministic.
        </label>
        <input
          type="number"
          value={settings.value.temperature}
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            if (value < 0 || value > 2) {
              value = 1;
            }

            updateSettings({ temperature: value });
          }}
        />

        <label style={{ marginTop: "4px" }}>
          Top P - An alternative to sampling with temperature, called nucleus sampling, where the
          model considers the results of the tokens with top_p probability mass. So 0.1 means only
          the tokens comprising the top 10% probability mass are considered.
        </label>
        <input
          type="number"
          value={settings.value.topP}
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            if (value < 0 || value > 1) {
              value = 0.9;
            }
            updateSettings({ topP: value });
          }}
        />

        <label style={{ marginTop: "4px" }}>
          Max Tokens - The maximum number of tokens to generate in the chat completion.
        </label>
        <input
          type="number"
          value={settings.value.maxTokens}
          onChange={(e) => {
            let value = parseInt(e.target.value, 10);
            updateSettings({ maxTokens: value });
          }}
        />

        <label style={{ marginTop: "4px" }}>
          Presence Penalty - Number between -2.0 and 2.0. Positive values penalize new tokens based
          on whether they appear in the text so far, increasing the model's likelihood to talk about
          new topics.
        </label>
        <input
          type="number"
          value={settings.value.presencePenalty}
          onChange={(e) => {
            let value = parseFloat(e.target.value);

            if (value < -2 || value > 2) {
              value = 0;
            }
            updateSettings({ presencePenalty: value });
          }}
        />

        <label style={{ marginTop: "4px" }}>
          Frequency Penalty - Number between -2.0 and 2.0. Positive values penalize new tokens based
          on their existing frequency in the text so far, decreasing the model's likelihood to
          repeat the same line verbatim.
        </label>
        <input
          type="number"
          value={settings.value.frequencyPenalty}
          onChange={(e) => {
            let value = parseFloat(e.target.value);

            if (value < -2 || value > 2) {
              value = 0;
            }
            updateSettings({ frequencyPenalty: value });
          }}
        />
      </div>
      <button
        onClick={() => {
          saveSettings(settings.value);
        }}
        disabled={isSaving || isSaved}
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
