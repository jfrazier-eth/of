import { useState } from "react";

import { FullPrompt, PromptMessage } from "@/backend/lib/prompts/types";
import { transformPrompt } from "@/backend/routes/api/ai/chat/transform-request-v2";
import { uid } from "@/utils/uid";

import { useUserConfig } from "../../context/user-config";
import { Message } from "./Message";
import { Preview } from "./Preview";
import PromptSettings from "./PromptSettings";

export const Prompt = ({
  prompt,
  updatePrompt,
  savePrompt,
  isSaving,
}: {
  prompt: FullPrompt;
  updatePrompt: (prompt: FullPrompt) => void;
  savePrompt: (prompt: FullPrompt) => void;
  isSaving: boolean;
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { emojis, customScript } = useUserConfig();

  const save = () => {
    savePrompt(prompt);
    setHasChanges(false);
  };

  const createMessage = () => {
    const role = prompt.messages.length > 0 ? "user" : "system";
    const message: PromptMessage = {
      id: uid(),
      promptId: prompt.id,
      role,
      messageIndex: prompt.messages.length,
      message: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setHasChanges(true);
    updatePrompt({
      ...prompt,
      messages: [...prompt.messages, message],
    });
  };

  const onMessageChange = (message: PromptMessage) => {
    const messages = prompt.messages;
    const index = messages.findIndex((item) => {
      return item.id === message.id;
    });

    if (index === -1) {
      setHasChanges(true);
      updatePrompt({
        ...prompt,
        messages: [...messages, message],
      });
    } else {
      messages[index] = message;
      setHasChanges(true);
      updatePrompt({
        ...prompt,
        messages: [...messages],
      });
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: prompt.isActive ? "green" : "red",
            paddingRight: "4px",
          }}
        >
          {prompt.isActive ? "Active" : "Disabled"}
        </p>
        {!prompt.isActive && (
          <button
            style={{
              height: "22px",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setHasChanges(true);
              updatePrompt({
                ...prompt,
                isActive: true,
              });
            }}
          >
            Activate
          </button>
        )}
      </div>
      <div>
        Messages:
        {prompt.messages
          .sort((a, b) => {
            return a.messageIndex - b.messageIndex;
          })
          .map((item) => {
            return (
              <Message
                key={item.id}
                message={item}
                onChange={(message) => {
                  onMessageChange(message);
                }}
              />
            );
          })}
      </div>
      {showPreview && (
        <Preview
          messages={transformPrompt(prompt, { emojis, customScript, messages: [] }).messages}
        />
      )}

      {showSettings && <PromptSettings promptId={prompt.id} />}
      <button
        style={{
          marginRight: "4px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createMessage();
        }}
      >
        Add Message
      </button>
      <button
        style={{
          marginRight: "4px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPreview((prev) => !prev);
        }}
      >
        Toggle Preview
      </button>
      <button
        style={{
          marginRight: "4px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowSettings((prev) => !prev);
        }}
      >
        Toggle Settings
      </button>

      <button
        disabled={isSaving || !hasChanges}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          save();
        }}
      >
        Save
      </button>
    </div>
  );
};
