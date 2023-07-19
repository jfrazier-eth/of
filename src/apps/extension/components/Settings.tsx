import React, { useState, useEffect } from "react";
import Toggle from "./inputs/Toggle.jsx";
import PriceInput from "./inputs/PriceInput.jsx";
import MediaInput from "./inputs/MediaInput.jsx";
import { Loader } from "./Loader.jsx";
import { LoggedInUser } from "../lib/extension/background/message-handlers/user-info.js";
import { sendMessage } from "../lib/extension/messages/send-message.js";

function countWords(script: string) {
  script = script.trim();
  const words = script.split(/\s+/);
  const wordCount = words.length;
  return wordCount;
}

const Settings: React.FC<{ user: LoggedInUser }> = (props) => {
  const [autoMessages, setAutoMessages] = useState(false);
  const [spendingThreshold, setSpendingThreshold] = useState(100);
  const [scripts, setScripts] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeMessageDefault, setWelcomeMessageDefault] = useState(false);

  //Need to figure out how to handle images. Is it better if we just take valut URLs, instead of letting ppl to upload?
  // const [selectedImage, setSelectedImage] = useState("");
  // const [ppvDefault1, setPpvDefault1] = useState("");
  // const [ppvDefault2, setPpvDefault2] = useState("");
  const [welcomePrice, setWelcomePrice] = useState(10);
  const [ppvPrice1, setPpvPrice1] = useState(5);
  const [ppvPrice2, setPpvPrice2] = useState(5);

  const [isLoading, setIsLoading] = useState(false);
  const [scriptWordCount, setScriptWordCount] = useState(0);

  useEffect(() => {
    setScriptWordCount(countWords(scripts));
  }, [scripts]);

  const toggleAutoMessages = () => {
    setAutoMessages(!autoMessages);
  };

  const toggleWelcomeMessageDefault = () => {
    setWelcomeMessageDefault(!welcomeMessageDefault);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await sendMessage({
        kind: "GET_OF_SETTINGS",
      });
      setAutoMessages(settings.data.autoMessages);
      setSpendingThreshold(settings.data.spendingThreshold);
      setScripts(settings.data.scripts);
      setWelcomeMessage(settings.data.welcomeMessage);
      setWelcomeMessageDefault(settings.data.welcomeMessageDefault);
      setWelcomePrice(settings.data.welcomePrice);
      setPpvPrice1(settings.data.ppvPrice1);
      setPpvPrice2(settings.data.ppvPrice2);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scriptWordCount > 700) {
      alert("Please ensure the script is under 700 words before saving.");
      return;
    }
    setIsLoading(true);

    await sendMessage({
      kind: "SAVE_OF_SETTINGS",
      data: {
        userId: props.user.userId,
        autoMessages,
        spendingThreshold,
        scripts,
        welcomeMessage,
        welcomeMessageDefault,
        welcomePrice,
        ppvPrice1,
        ppvPrice2,
      },
    });
    setIsLoading(false);
  };
  const labelClass = "block text-sm font-medium leading-6 mt-4";
  const textAreaClass =
    "block font-normal w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex relative h-full flex-col divide-gray-200 bg-white shadow-xl w-[400px]"
    >
      <div className="h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col items-start justify-start h-screen w-full">
          <div className="bg-primary text-white w-full text-left p-4">
            <h1 className="text-base font-bold">Settings</h1>
            <p className="text-sm mt-2">
              Change the settings below to change how the AI performs
            </p>
          </div>
          <div className="p-4 text-gray-900 w-full ">
            <div className="flex">
              <label className={labelClass}>
                <span className="mr-2">Enable Automatic Messages</span>
              </label>
              <Toggle enabled={autoMessages} setEnabled={toggleAutoMessages} />
            </div>
            <label htmlFor="price" className={labelClass}>
              Spending Threshold
            </label>
            <PriceInput
              price={spendingThreshold}
              setPrice={setSpendingThreshold}
            />
            <label htmlFor="script" className={labelClass}>
              <span>Sample Scripts for Training</span>
            </label>
            <textarea
              value={scripts}
              onChange={(e) => setScripts(e.target.value)}
              className={textAreaClass}
              rows={8}
              placeholder="Paste your sample scripts here. The AI will use these to influence it's messaging style. (Max 700 words)"
            ></textarea>
            {scriptWordCount > 700 && (
              <div className="text-red-500 text-sm mt-2">
                The current script is {scriptWordCount} words, please keep it
                under 700 words.
              </div>
            )}
            <div className="mt-4">
              <div className="flex">
                <label className={labelClass}>
                  <span className="mr-2">Welcome Message default</span>
                </label>
                <Toggle
                  enabled={welcomeMessageDefault}
                  setEnabled={toggleWelcomeMessageDefault}
                />
              </div>
              <label className={`flex flex-col ${labelClass}`}>
                <span className="mr-2">Select an image</span>
              </label>
              <MediaInput />
              <label htmlFor="welcomePrice" className={labelClass}>
                Set Price
              </label>
              <PriceInput price={welcomePrice} setPrice={setWelcomePrice} />
              <label htmlFor="welcomeMessage" className={labelClass}>
                <span className="mr-2">Default Welcome Message</span>
              </label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className={textAreaClass}
                rows={4}
                placeholder="Insert default welcome message to send to subscribers initially."
              ></textarea>
              <label className={`flex flex-col ${labelClass}`}>
                <span className="mr-2">PPV default 1</span>
              </label>
              <MediaInput />
              <label htmlFor="price1" className={labelClass}>
                Set Price
              </label>
              <PriceInput price={ppvPrice1} setPrice={setPpvPrice1} />
              <label className={`flex flex-col ${labelClass}`}>
                <span className="mr-2">PPV default 2</span>
              </label>
              <MediaInput />
              <label htmlFor="price2" className={labelClass}>
                Set Price
              </label>
              <PriceInput price={ppvPrice2} setPrice={setPpvPrice2} />
              <div className="flex justify-end my-6">
                <button
                  type="submit"
                  className="justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {isLoading ? <Loader /> : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Settings;
