import { Response, Request } from "express";
import { chatGptCompletion } from "./helper.js";

interface CreatorData {
  background: string;
  goal: string;
  wishList: string;
  wishListItems: string;
}

const constructPayload = (
  fan_name: string,
  creatorData: CreatorData,
  msgObjs: unknown
) => {
  const messages = [];
  let { background, goal, wishList, wishListItems } = creatorData;
  //have fallbacks if background, goal, wishList, wishListItems are empty

  const systemObj = {
    role: "system",
    content: `I am an only fans creator and this is my background in 3 backticks - \`\`\`${background}\`\`\`\n\nYou are my AI assistant designed to manage the DMs sent by my fans. Your goal is to ${goal} \nWhenever a user sends a message, here are possible ways of making the user tip the creator:\n1. Send Private Pics: Guide the conversation in such a way that the user asks you to send private pics. When this happens, you will prompt the user to pay $5 in tips for each picture. \n2.Have a video call: Guide the conversation in such a way that the user would want to get on a private video call with you. When this happens, you will just respond saying that you will get back with a time slot. You will do whatever the user asks in this video call.\n3.Make users buy stuff for you from your amazon Wishlist. Here is your current Wishlist: ${wishList}. This Wishlist has: ${wishListItems}\n\nRules of the conversation:\n1. Behave like the creator and not like an AI. \n2. Keep the conversations natural and interactive. \n3. Keep the messages short. \n4. Do not directly deny any of the user requests, rather, guide them gently into paying tips with the above methods. \n\nThe name of the user is ${fan_name}. Address him with the name and use stuff like 'dear', 'babe', 'love' etc.. to keep the conversation intimate. `,
  };

  console.log(systemObj.content);
  messages.push(systemObj);
  //construct user obj
  const userObj = {
    role: "user",
    content: `Here is the conversation history (max of last 10 message exchanges) in the form of an array:\n${JSON.stringify(
      msgObjs
    )}\n\nNow, respond to the user by following the given rules. Respond in Json in the following format: {role: creator, content: 'your message'}`,
  };

  messages.push(userObj);
  console.log(userObj.content);

  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    max_tokens: 200,
    stream: false,
  };
  return payload;
};

//takes in the creator_id and sends the response. For now return dummy data
const getCreatorData = async (creator_id: string) => {
  return {
    background: "I would love to give my fans a girl friend experience.",
    goal: "maintain intimate and erotic conversations with the users and to make sure the creator earns more money through these DMs.",
    wishList:
      "https://www.amazon.com/hz/wishlist/ls/2MAZWDPOR3OYV?ref_=wl_share",
    wishListItems: "lingerie sets and cosmetics",
  };
};

const generateResponse = async (req: Request, res: Response) => {
  try {
    //First get the creator data from the db
    const creatorData = await getCreatorData(req.body.creator_id);

    //construct the payload by taking the fan name, creator data and the messages
    const payload = constructPayload(
      req.body.fan_name,
      creatorData,
      req.body.messages
    );
    let response = await chatGptCompletion(payload);

    //error check the response. 2 errors may occur: 1. Response isn't well formatted. 2. GPT refused to answer this question
    response = await JSON.parse(response);
    res.status(200).send(response.content);
  } catch (error) {
    console.log("Came to error");
    console.log(error);
    res.status(500).send("Couldn't fetch the answer. Please try again later.");
  }
};

export { generateResponse };
