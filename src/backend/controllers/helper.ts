//These are universal and application independent functions
import axios from "axios";
import { config } from "../config.js";

const chatGptEndPoint = "https://api.openai.com/v1/chat/completions";

const chatGptCompletion = async (payload: unknown) => {
  console.log("Came to OF Completion");
  const openAIHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.openAI.apiKey}`,
  };

  try {
    const response = await axios.post(chatGptEndPoint, payload, {
      headers: openAIHeaders,
      responseType: "json",
    });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { chatGptCompletion };
