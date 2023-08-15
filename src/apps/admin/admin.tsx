import { useState } from "react";
import { useContext } from "react";

import { AdminContext } from "./context/admin";
import { Prompts } from "./prompts";

type Tab = "prompt" | "settings" | "playground";

const NavBar = (props: { tab: Tab, setTab: (tab: Tab) => void }) => {
  const handleClick = (tab: Tab) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.setTab(tab);
  }
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
    }}>
      <button disabled={props.tab === 'prompt'} onClick={handleClick('prompt')}>Prompt</button>
      <button disabled={props.tab === 'settings'} onClick={handleClick("settings")}>settings</button>
      <button disabled={props.tab === 'playground'} onClick={handleClick("playground")}>playground</button>
    </div>
  );
}

export const Page = (props: { tab: Tab }) => {
  switch (props.tab) {
    case 'prompt':
      return <Prompts />
    case "settings":
      return <div>settings</div>;
    case "playground":
      return <div>playground</div>;
  }
}

export const Admin = () => {
  const { admin, isChecking, login, logout } = useContext(AdminContext);
  const [passwordValue, setPasswordValue] = useState("");

  const [tab, setTab] = useState<Tab>("prompt");

  if (!admin.isReady) {
    return <div>loading...</div>;
  }

  if (admin.value.isLoggedIn) {
    return (<div>
      <NavBar tab={tab} setTab={setTab} />
      <Page tab={tab} />
    </div>);
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
