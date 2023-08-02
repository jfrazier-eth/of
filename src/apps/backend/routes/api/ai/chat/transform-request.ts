import * as OpenAI from "@/lib/open-ai";

import { AIChatRequestBody } from "./types";

export const transformRequest = (
  request: AIChatRequestBody
): OpenAI.ChatCompletion.ChatCompletionRequest => {
  const options = OpenAI.ChatCompletion.Defaults.defaultChatCompletionRequestOptions;

  const completionOptions: Omit<OpenAI.ChatCompletion.ChatCompletionRequest, "messages"> = {
    ...options,
  };

  const getUserById = (id: string) => {
    return request.user.id === id ? request.user : request.withUser;
  };

  const emojisPrompt = request.emojis ? `and use erotic emojis such as ${request.emojis}` : "";
  const script = request.customScript
    ? `\nHere is a part of old script with a different fan to help you understand my style of conversation: \n\`\`\`\n${request.customScript}`
    : "";

  const systemObj: OpenAI.Messages.Message = {
    role: "system",
    content: `I am an only fans creator and you are my AI assistant designed to make conversations with my fans. I will send you a maximum of last 20 conversation exchanges between me and my fan, your goal is to understand the context from these exchanges and respond back imitating my style following the same flow. Remember, you are here to continue the conversation I started, so make sure it is natural. This means that you should not include a greeting! The fan must not know that it's an AI who is responding to the messages. In general these are the kind of conversations that happen between me and my fan:\n1. The fan might have tipped me to do sexting and you must continue doing that.\n2. Your goal is to maintain erotic & initimate conversations and slowly guide the user towards giving me tips. The way we can get the tips from the user is by sending private pictures, videos, voice texts moaning the fan's name or having a private video call. \n\nIn general, you must follow these rules:\n1. Behave like me (onlyfans creator) and not like an AI.\n2. Understand the context from message history and respond in the same style & tone. Also keep the messages short.${
      emojisPrompt ? " " + emojisPrompt : ""
    }. \n3. Do not directly deny any of the user's requests, rather, guide them gently into giving us tips.\n4. I will give you the name of the user. In case the name is unavailable or improper (sometimes we get fake names like u172328), you can just call him 'dear'.${
      script ? " " + script : ""
    }\n\`\`\` \n.5.Perform a depth first search into the current topic. \nConfirm that you understand the task.`,
  };

  const assistantObj: OpenAI.Messages.Message = {
    role: "assistant",
    content: `I understand the task. I will follow all the 5 rules you mentioned without fail. I looked at the old script you gave and will use that along with the message history to imitate your style while responding. Give me the conversation history, using which I will understand the context of conversation and will continue it.`,
  };

  const systemObj2: OpenAI.Messages.Message = {
    role: "system",
    content:
      "Good, remember that you are not to include a greeting in your response. Now I will give you the conversation history.",
  };

  const chatMessages: OpenAI.Messages.Message[] = request.messages.map((item) => {
    const user = getUserById(item.fromUserId);

    if (user.id === request.user.id) {
      return {
        role: "assistant",
        content: item.content,
      };
    }
    return {
      role: "user",
      content: item.content,
    };
  });

  const messages = [systemObj, assistantObj, systemObj2, ...chatMessages];

  return {
    ...completionOptions,
    messages,
  };
};
