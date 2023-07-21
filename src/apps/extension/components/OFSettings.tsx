import React, { useState } from "react";

import { UserOFSettings } from "../lib/extension/messages/responses";
import { Button } from "./Button";
import { Loader } from "./Loader";
import MediaInput from "./inputs/MediaInput";
import PriceInput from "./inputs/PriceInput";
import Toggle from "./inputs/Toggle";
import { Media } from "./media-grid/Media";
import { MediaGrid } from "./media-grid/MediaGrid";

type Section = "WELCOME" | "PPV1" | "PPV2";

const OFSettings: React.FC<{
  settings: UserOFSettings;
  setSettings: (handler: (prevState: UserOFSettings) => UserOFSettings) => void;
  saveSettings: () => Promise<void>;
}> = ({ settings, setSettings, saveSettings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaGridContext, setMediaGridContext] = useState<{ isOpen: boolean; section: Section }>({
    isOpen: false,
    section: "WELCOME",
  });

  const toggleAutoMessages = () => {
    setSettings((prev) => {
      return {
        ...prev,
        autoMessages: !prev.autoMessages,
      };
    });
  };

  const toggleWelcomeMessageDefault = () => {
    setSettings((prev) => {
      return {
        ...prev,
        welcomeMessageDefault: !prev.welcomeMessageDefault,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await saveSettings();
    setIsLoading(false);
  };
  const labelClass = "block text-sm font-medium leading-6 mt-4";
  const textAreaClass =
    "block font-normal w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "flex relative h-full flex-col divide-gray-200 bg-white shadow-xl w-[400px] overflow-auto"
      }
    >
      <MediaGrid
        title="Select media from your vault"
        open={mediaGridContext.isOpen}
        onClose={() => setMediaGridContext((prev) => ({ isOpen: false, section: prev.section }))}
        onSelect={(item) => {
          console.log(`Media selected ${item.id} Section ${mediaGridContext.section}}`);
          switch (mediaGridContext.section) {
            case "WELCOME": {
              setSettings((prev) => ({
                ...prev,
                welcomeMedia: item,
              }));
              break;
            }
            case "PPV1": {
              setSettings((prev) => ({
                ...prev,
                ppvDefault1Media: item,
              }));
              break;
            }
            case "PPV2": {
              setSettings((prev) => ({
                ...prev,
                ppvDefault2Media: item,
              }));
              break;
            }
          }
        }}
      />
      <div className="h-0 flex-1">
        <div className="flex flex-col items-start justify-start h-screen w-full">
          <div className="bg-primary text-white w-full text-left p-4">
            <h1 className="text-base font-bold">Settings</h1>
            <p className="text-sm mt-2">Change the settings below to change how the AI performs</p>
          </div>
          <div className="p-4 text-gray-900 w-full ">
            <div className="flex">
              <label className={labelClass}>
                <span className="mr-2">Enable Automatic Messages</span>
              </label>
              <Toggle enabled={settings.autoMessages} setEnabled={toggleAutoMessages} />
            </div>
            <label htmlFor="price" className={labelClass}>
              Spending Threshold
            </label>
            <PriceInput
              price={settings.spendingThreshold}
              setPrice={(newValueOrHandler) => {
                setSettings((prevState) => ({
                  ...prevState,
                  spendingThreshold:
                    typeof newValueOrHandler === "function"
                      ? newValueOrHandler(prevState.spendingThreshold)
                      : newValueOrHandler,
                }));
              }}
            />
            <label htmlFor="script" className={labelClass}>
              <span>Sample Scripts for Training</span>
            </label>
            <textarea
              value={settings.scripts}
              onChange={(e) =>
                setSettings((prev) => {
                  if (e.target.value.length >= 700) {
                    alert("Script must be less than 700 characters.");
                    return {
                      ...prev,
                      scripts: e.target.value.substring(0, 700),
                    };
                  }
                  return {
                    ...prev,
                    scripts: e.target.value,
                  };
                })
              }
              className={textAreaClass}
              rows={8}
              placeholder="Paste your sample scripts here. The AI will use these to influence it's messaging style. (Max 700 words)"
            ></textarea>
            <div className="mt-4">
              <div className="flex">
                <label className={labelClass}>
                  <span className="mr-2">Welcome Message default</span>
                </label>
                <Toggle
                  enabled={settings.welcomeMessageDefault}
                  setEnabled={toggleWelcomeMessageDefault}
                />
              </div>
              <label htmlFor="welcomePrice" className={labelClass}>
                Set Price
              </label>
              <PriceInput
                price={settings.welcomePrice}
                setPrice={(newValueOrHandler) => {
                  setSettings((prevState) => ({
                    ...prevState,
                    welcomePrice:
                      typeof newValueOrHandler === "function"
                        ? newValueOrHandler(prevState.welcomePrice)
                        : newValueOrHandler,
                  }));
                }}
              />
              <label htmlFor="welcomeMessage" className={labelClass}>
                <span className="mr-2">Default Welcome Message</span>
              </label>
              <textarea
                value={settings.welcomeMessage}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    welcomeMessage: e.target.value,
                  }));
                }}
                className={textAreaClass}
                rows={4}
                placeholder="Insert default welcome message to send to subscribers initially."
              ></textarea>
              {settings.welcomeMedia && (
                <div className="flex flex-col mt-2 w-[50%]">
                  <Media media={settings.welcomeMedia} />
                </div>
              )}
              <label className={`flex flex-col ${labelClass} mt-2`}>
                <Button
                  onClick={() => setMediaGridContext({ isOpen: true, section: "WELCOME" })}
                  label="Select welcome message media"
                />
              </label>

              <label className={`flex flex-col ${labelClass}`}>
                <span className="mr-2">PPV default 1</span>
              </label>

              <label htmlFor="price1" className={labelClass}>
                Set Price
              </label>
              <PriceInput
                price={settings.ppvPrice1}
                setPrice={(newValueOrHandler) => {
                  setSettings((prevState) => ({
                    ...prevState,
                    ppvPrice1:
                      typeof newValueOrHandler === "function"
                        ? newValueOrHandler(prevState.ppvPrice1)
                        : newValueOrHandler,
                  }));
                }}
              />
              {settings.ppvDefault1Media && (
                <div className="flex flex-col mt-2 w-[50%]">
                  <Media media={settings.ppvDefault1Media} />
                </div>
              )}
              <label className={`flex flex-col ${labelClass} mt-2`}>
                <Button
                  onClick={() => setMediaGridContext({ isOpen: true, section: "PPV1" })}
                  label="Select PPV1 media"
                />
              </label>
              <label className={`flex flex-col ${labelClass}`}>
                <span className="mr-2">PPV default 2</span>
              </label>
              <label htmlFor="price2" className={labelClass}>
                Set Price
              </label>
              <PriceInput
                price={settings.ppvPrice2}
                setPrice={(newValueOrHandler) => {
                  setSettings((prevState) => ({
                    ...prevState,
                    ppvPrice2:
                      typeof newValueOrHandler === "function"
                        ? newValueOrHandler(prevState.ppvPrice2)
                        : newValueOrHandler,
                  }));
                }}
              />
              {settings.ppvDefault2Media && (
                <div className="flex flex-col mt-2 w-[50%]">
                  <Media media={settings.ppvDefault2Media} />
                </div>
              )}
              <label className={`flex flex-col ${labelClass} mt-2`}>
                <Button
                  onClick={() => setMediaGridContext({ isOpen: true, section: "PPV2" })}
                  label="Select PPV2 media"
                />
              </label>
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

export default OFSettings;
