import { PromptMessage } from "@/backend/lib/prompts/types";

export const Message = ({
  message,
  onChange,
}: {
  message: PromptMessage;
  onChange: (message: PromptMessage) => void;
}) => {
  return (
    <div
      style={{
        margin: "8px",
      }}
    >
      <div>
        <label
          style={{
            paddingRight: "4px",
          }}
        >
          Role:
        </label>
        <select
          value={message.role}
          onChange={(e) => {
            const role = e.target.value as "system" | "user" | "assistant";
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
          flexDirection: "column",
        }}
      >
        <label
          style={{
            paddingRight: "4px",
          }}
        >
          Text:
        </label>
        <textarea
          style={{
            minHeight: "100px",
          }}
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
