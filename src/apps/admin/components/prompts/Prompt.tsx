import { useState } from "react";

import { FullPrompt, PromptMessage } from "@/backend/lib/prompts/types";
import { transformPrompt } from "@/backend/routes/api/ai/chat/transform-request-v2";
import { uid } from "@/utils/uid";

import { Message } from "./Message";
import { Preview } from "./Preview";

const emojis = "😈";
const customScript = "Hello World!";

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
      <div>
        Active: {prompt.isActive.toString()}{" "}
        {!prompt.isActive && (
          <button
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
        )}{" "}
        {hasChanges && (
          <button
            disabled={isSaving}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              save();
            }}
          >
            Save{" "}
          </button>
        )}
      </div>
      <div>
        {" "}
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
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createMessage();
        }}
      >
        Add Message
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPreview((prev) => !prev);
        }}
      >
        {" "}
        Toggle Preview{" "}
      </button>
      {showPreview && (
        <Preview
          messages={transformPrompt(prompt, { emojis, customScript, messages: [] }).messages}
        />
      )}
    </div>
  );
};
