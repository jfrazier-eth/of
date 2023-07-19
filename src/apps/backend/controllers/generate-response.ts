import { Response, Request } from "express";
import { chatGptCompletion } from "./helper";
import { userSettingsModel } from "../models/only-fans/user-settings";
import { msgHistoryModel } from "../models/only-fans/message-history";

interface ChatMessage {
  role: string;
  content: string;
}

type ChatArray = ChatMessage[];

function formatChat(chatArray: ChatArray): string {
  let chatStr = "";
  chatArray.forEach((chat: ChatMessage) => {
    chatStr += `${chat.role}: ${chat.content}\n`;
  });
  return chatStr;
}

const constructPayload = (
  fanName: string,
  scripts: string,
  msgHistory: string
) => {
  const messages: any[] = [];

  const emojis = "💦🥵💋";

  const systemObj = {
    role: "system",
    content: `I am an only fans creator and you are my AI assistant designed to make conversations with my fans. I will send you a maximum of last 20 conversation exchanges between me and my fan, your goal is to understand the context from these exchanges and respond back imitating my style following the same flow. Remember, you are here to continue the conversation I started, so make sure it is natural. The fan must not know that it's an AI who is responding to the messages. In general these are the kind of conversations that happen between me and my fan:\n1. The fan might have tipped me to do sexting and you must continue doing that.\n2. It's a general conversation and the fan just subscribed to me. So your goal is to maintain erotic & initimate conversations and slowly guide the user towards giving me tips. The way we can get the tips from the user is by sending private pictures, videos, voice texts moaning the fan's name or having a private video call.  \n\nIn general, you must follow these rules:\n1. Behave like me (onlyfans creator) and not like an AI.\n2. Understand the context from message history and respond in the same style & tone. Also keep the messages short and use erotic emojis such as ${emojis}. \n3. Do not directly deny any of the user's requests, rather, guide them gently into giving us tips.\n4. I will give you the name of the user. Address with the name and use stuff like 'dear', 'babe', 'love' etc. In case the name is unavailable or improper (sometimes we get fake names like u172328), you can just call him 'dear'.\nHere is a part of old script with a different fan to help you understand my style of conversation: \n\`\`\`\n${scripts}\n\`\`\` \n.`,
  };
  messages.push(systemObj);
  //construct user obj
  const userObj = {
    role: "user",
    content: `Confirm that you understand the task and I will give you the current conversation history and the format of response i expect.`,
  };

  messages.push(userObj);

  const assistantObj = {
    role: "assistant",
    content: `I understand the task. I will follow all the 4 rules you mentioned without fail. I looked at the old script you gave and will use that along with the message history to imitate your style while responding. Give me the conversation history, using which I will understand the context of conversation and will continue it. And give me the format of response, I will stick to that while responding.`,
  };

  messages.push(assistantObj);

  const userObj2 = {
    role: "user",
    content: `Excellent! Remember, the script I gave earlier is not related to this fan. I gave it so that you understand my style of conversation. Here is my conversation with the current fan:\n\`\`\`\n${msgHistory}\n\`\`\`\nNow continue this conversation naturally, DO NOT START IT AGAIN WITH A SALUTATION like 'Hey there!'. We are already in the middle of the conversation. Respond in json like this - { role: \"creator\", content: \"the actual response\"}. The name of the fan is ${fanName}. Go ahead with a response now.\n`,
  };

  messages.push(userObj2);
  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.5,
    max_tokens: 200,
    stream: false,
  };
  return payload;
};

const checkTipStatus = (messages: any) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "creator") {
      return { isTip: false, tipAmount: null };
    } else if (message.role === "fan" && message.isTip) {
      return { isTip: true, tipAmount: message.tipAmount };
    }
  }
  return { isTip: false, tipAmount: null };
};

const sendNotification = async (userId: number, tipAmount: number) => {
  //console.log(`Sending Notification to ${userId}: Tip Amount ${tipAmount}`)
};
const generateResponse = async (req: Request, res: Response) => {
  try {
    const userSettings = await userSettingsModel.findOne({
      userId: Number(req.body.userId),
    });
    const scripts = userSettings?.scripts || "";
    const conversationHistory = formatChat(req.body.messages);
    const tipStatus = checkTipStatus(req.body.messages);

    //generate response only if it isn't tipped msg
    if (!tipStatus.isTip) {
      const payload = constructPayload(
        req.body.fanName,
        scripts,
        conversationHistory
      );

      let response = await chatGptCompletion(payload);
      response = await JSON.parse(response);
      console.log(response);
      res.status(200).send({ tipAmount: null, response: response.content });
      //save the response to the database
      const msgHistory = new msgHistoryModel({
        userId: req.body.userId,
        fanId: req.body.fanId,
        fanName: req.body.fanName,
        messages: req.body.messages,
        AIResponse: response.content, //make sure this is the correct path for your response
      });
      await msgHistory.save();
    } else {
      res.status(200).send({ tipAmount: tipStatus.tipAmount, response: null });
      sendNotification(req.body.userId, tipStatus.tipAmount);
    }
  } catch (error) {
    console.log("Came to error");
    console.log(error);
    res.status(500).send("Couldn't fetch the answer. Please try again later.");
  }
};

export { generateResponse };
