import { FullPrompt } from "@/backend/lib/prompts";

export const transformPrompt = (
  prompt: FullPrompt,
  options: {
    emojis: string;
    customScript: string;
    messages: { role: "assistant" | "user"; content: string }[];
  }
) => {
  const promptMessages = prompt.messages.sort((a, b) => a.messageIndex - b.messageIndex);
  const messages = [...promptMessages, ...options.messages];

  let formattedMessages = [];
  for (const item of promptMessages) {
    let message = item.message;

    message = message.replace("{emojis}", options.emojis || "");
    const hasScript = message.includes("{customScript}");
    console.log(`Has script: ${hasScript}`);
    message = message.replace("{customScript}", options.customScript || "");

    formattedMessages.push({
      role: item.role,
      content: message,
    });
  }
  formattedMessages.push(...options.messages);

  return {
    messages: formattedMessages,
  };
};
