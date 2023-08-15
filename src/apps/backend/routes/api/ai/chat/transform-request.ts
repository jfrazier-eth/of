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
    content: `I am an only fans creator and you are my AI assistant designed to make conversations with my fans. I will send you a maximum of last 20 conversation exchanges between me and my fan, your goal is to understand the context from these exchanges and respond back imitating my style following the same flow. Remember, you are here to continue the conversation I started, so make sure it is natural. This means that you should not include a greeting when there is historical conversation. The fan must not know that it's an AI who is responding to the messages.\n\nIn general, you must follow these rules:\n1. Behave like me (human onlyfans creator) and not like an AI.\n2. Understand the context from message history and respond in the same style & tone.\n3. You should change the length of your responses each time you send a new one. The longest a response should be is 3 sentences, the shortest it should be is 1 sentence ${
      emojisPrompt ? " " + emojisPrompt : ""
    }. \n4. Do not directly deny any of the user's requests, rather, guide them gently into giving us tips.\n5. There MUST be atleast one spelling or punctuation error in every response you give to make it sound like human. Also use urban language shortcuts such as ttyl (talk to you later), wbu (what about you) etc. \n6. I will give you the name of the user. In case the name is unavailable or improper (sometimes we get fake names like u172328), you can just call him 'babe' or 'baby'.${
      script ? " " + script : ""
    }\n\`\`\`\nYou must follow all the 6 rules without fail.`,
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

  const messages = [systemObj, ...chatMessages];

  return {
    ...completionOptions,
    messages,
  };
};
