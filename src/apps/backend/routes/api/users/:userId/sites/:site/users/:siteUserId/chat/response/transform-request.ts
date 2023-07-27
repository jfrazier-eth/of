import * as OpenAI from "@/lib/open-ai";

import { GenerateChatRequestBody } from "./types";


export const transformRequest = (
  request: GenerateChatRequestBody,
  settings: {
    customScript?: string;
    emojis?: string;
  },
  options: {
    model?: OpenAI.ChatCompletion.ChatCompletionRequest["model"];
    temperature?: OpenAI.ChatCompletion.ChatCompletionRequest["temperature"];
    top_p?: OpenAI.ChatCompletion.ChatCompletionRequest["top_p"];
    n?: OpenAI.ChatCompletion.ChatCompletionRequest["n"];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Record<string, number>;
  }
): OpenAI.ChatCompletion.ChatCompletionRequest => {
  const defaultOptions = OpenAI.ChatCompletion.Defaults.defaultChatCompletionRequestOptions;

  const completionOptions: Omit<OpenAI.ChatCompletion.ChatCompletionRequest, "messages"> = {
    ...defaultOptions,
    ...options,
  };

  const getUserById = (id: string) => {
    return request.user.id === id ? request.user : request.chat.withUser;
  };

  const chat = request.chat.messages
    .map((item) => {
      const user = getUserById(item.fromUser.id);

      return `${user.name || user.handle || user.id}: ${item.text}`;
    })
    .join("\n");

  const emojisPrompt = settings.emojis ? `and use erotic emojis such as ${settings.emojis}` : "";
  const script = settings.customScript
    ? `\nHere is a part of old script with a different fan to help you understand my style of conversation: \n\`\`\`\n${settings.customScript}`
    : "";

  const systemObj: OpenAI.Messages.Message = {
    role: "system",
    content: `I am an only fans creator and you are my AI assistant designed to make conversations with my fans. I will send you a maximum of last 20 conversation exchanges between me and my fan, your goal is to understand the context from these exchanges and respond back imitating my style following the same flow. Remember, you are here to continue the conversation I started, so make sure it is natural. The fan must not know that it's an AI who is responding to the messages. In general these are the kind of conversations that happen between me and my fan:\n1. The fan might have tipped me to do sexting and you must continue doing that.\n2. It's a general conversation and the fan just subscribed to me. So your goal is to maintain erotic & initimate conversations and slowly guide the user towards giving me tips. The way we can get the tips from the user is by sending private pictures, videos, voice texts moaning the fan's name or having a private video call.  \n\nIn general, you must follow these rules:\n1. Behave like me (onlyfans creator) and not like an AI.\n2. Understand the context from message history and respond in the same style & tone. Also keep the messages short${emojisPrompt ? " " + emojisPrompt : ""
      }. \n3. Do not directly deny any of the user's requests, rather, guide them gently into giving us tips.\n4. I will give you the name of the user. Address with the name and use stuff like 'dear', 'babe', 'love' etc. In case the name is unavailable or improper (sometimes we get fake names like u172328), you can just call him 'dear'.${script ? " " + script : ""
      }\n\`\`\` \n.`,
  };

  const userObj: OpenAI.Messages.Message = {
    role: "user",
    content: `Confirm that you understand the task and I will give you the current conversation history and the format of response i expect.`,
  };

  const assistantObj: OpenAI.Messages.Message = {
    role: "assistant",
    content: `I understand the task. I will follow all the 4 rules you mentioned without fail. I looked at the old script you gave and will use that along with the message history to imitate your style while responding. Give me the conversation history, using which I will understand the context of conversation and will continue it. And give me the format of response, I will stick to that while responding.`,
  };

  let userObj2: OpenAI.Messages.Message;
  if (request.isPPV) {
    userObj2 = {
      role: "user",
      content: `Excellent! Remember, the script I gave earlier is not related to this fan. I gave it so that you understand my style of conversation. Here is my conversation with the current fan:\n\`\`\`\n${chat}\n\`\`\`\nNow continue this conversation naturally and respond in a way that attempts to get the user to purchase the erotic pay per view media that will be attached to your message. You should continue the conversation naturally, DO NOT START IT AGAIN WITH A SALUTATION like 'Hey there!'. We are already in the middle of the conversation. Respond in json like this - { role: \"creator\", content: \"the actual response\"}. The name of the fan is ${request.chat.withUser.name}. Go ahead with a response now.\n`,
    };
  } else {
    userObj2 = {
      role: "user",
      content: `Excellent! Remember, the script I gave earlier is not related to this fan. I gave it so that you understand my style of conversation. Here is my conversation with the current fan:\n\`\`\`\n${chat}\n\`\`\`\nNow continue this conversation naturally, DO NOT START IT AGAIN WITH A SALUTATION like 'Hey there!'. We are already in the middle of the conversation. Respond in json like this - { role: \"creator\", content: \"the actual response\"}. The name of the fan is ${request.chat.withUser.name}. Go ahead with a response now.\n`,
    };
  }


  const messages = [systemObj, userObj, assistantObj, userObj2];

  return {
    ...completionOptions,
    messages,
  };
};
