import { useState } from "react";
import { useContext } from "react";

import { AdminContext } from "./context/admin";
import { Prompts } from "./prompts";

export const Admin = () => {
  const { admin, isChecking, login, logout } = useContext(AdminContext);
  const [passwordValue, setPasswordValue] = useState("");

  if (!admin.isReady) {
    return <div>loading...</div>;
  }

  if (admin.value.isLoggedIn) {
    return (
      <div>
        {" "}
        <Prompts />{" "}
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
        {" "}
        Login{" "}
      </button>
    </div>
  );
};
