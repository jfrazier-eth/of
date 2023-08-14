import React, { useState } from "react";
import { useContext } from "react";

import { FullPrompt, PromptMessage } from "@/backend/lib/prompts/types";
import { uid } from "@/utils/uid";

import { PromptContext } from "./context/prompts";

const Message = ({
  message,
  onChange,
}: {
  message: PromptMessage;
  onChange: (message: PromptMessage) => void;
}) => {
  return (
    <div>
      <div
        style={{
          padding: "1rem",
        }}
      >
        Role:
        <select
          value={message.role}
          onChange={(e) => {
            const role = e.target.value as "system" | "user" | "assistant";
            console.log(`Updating role ${role}`);
            onChange({
              ...message,
              role,
            });
          }}
        >
          <option value="system">System</option>
          <option value="user">User</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          padding: "1rem",
        }}
      >
        Text:
        <textarea
          value={message.message}
          onChange={(e) => {
            onChange({
              ...message,
              message: e.target.value,
            });
          }}
        ></textarea>
      </div>
    </div>
  );
};

const Prompt = ({
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
    </div>
  );
};

const PromptsList = ({
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
    <div>
      {prompts
        .sort((a, b) => {
          return a.version - b.version;
        })
        .map((prompt) => {
          return (
            <div
              key={prompt.id}
              style={{
                padding: "1rem",
              }}
            >
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
      <div>Prompts</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createPrompt();
        }}
      >
        New
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
