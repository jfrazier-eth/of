import { ChatMessage } from "@/lib/open-ai/messages/types";

export const Preview = ({ messages }: { messages: ChatMessage[] }) => {
  return (
    <div
      style={{
        overflow: "auto",
      }}
    >
      {messages.map((message, index) => (
        <div key={index}>
          <p style={{ color: "blue" }}>{message.role}:</p> <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};
