import { PromptMessage } from "@/backend/lib/prompts/types";

export const Message = ({
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
