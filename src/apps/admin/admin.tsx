import { MouseEventHandler, useState } from "react";
import { useContext } from "react";

import { Playground } from "./components/playground/Playground";
import { AdminContext } from "./context/admin";
import { useUserConfig } from "./context/user-config";
import { Prompts } from "./prompts";

type Tab = "prompt" | "playground";

const NavBar = (props: { tab: Tab; setTab: (tab: Tab) => void }) => {
  const handleClick = (tab: Tab): MouseEventHandler<HTMLButtonElement> => (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.setTab(tab);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <button
        style={{
          marginRight: "4px",
        }}
        disabled={props.tab === "prompt"}
        onClick={handleClick("prompt")}
      >
        Prompts
      </button>
      <button
        style={{
          marginRight: "4px",
        }}
        disabled={props.tab === "playground"}
        onClick={handleClick("playground")}
      >
        Playground
      </button>
    </div>
  );
};

export const Page = (props: { tab: Tab }) => {
  switch (props.tab) {
    case "prompt":
      return <Prompts />;
    case "playground":
      return <Playground />;
  }
};

export const Admin = () => {
  const { admin, isChecking, login, logout } = useContext(AdminContext);
  const [passwordValue, setPasswordValue] = useState("");
  const { emojis, setEmojis, customScript, setCustomScript } = useUserConfig();

  const [tab, setTab] = useState<Tab>("prompt");

  if (!admin.isReady) {
    return <div>loading...</div>;
  }

  if (admin.value.isLoggedIn) {
    return (
      <div style={{ paddingBottom: "300px" }}>
        <NavBar tab={tab} setTab={setTab} />
        <div style={{ marginTop: "8px", maxWidth: "700px" }}>
          <label style={{ paddingRight: "4px" }}>Emojis</label>
          <input type="text" value={emojis} onChange={(e) => setEmojis(e.target.value)}></input>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Custom Script</label>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
            ></textarea>
          </div>
        </div>
        <Page tab={tab} />
      </div>
    );
  }
  return (
    <div>
      <div> Please login </div>
      <input
        type="text"
        placeholder="password"
        onChange={(e) => {
          setPasswordValue(e.target.value);
        }}
      ></input>
      <button
        disabled={isChecking}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          login(passwordValue);
        }}
      >
        Login
      </button>
    </div>
  );
};
