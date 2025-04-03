import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "./App.js";
export const ChangeProfile = () => {
  const { setUsername } = useContext(AppContext);
  let [newUsername, setNewUserName] = useState("");
  return (
    <div>
      <input
        onChange={(event) => {
          setNewUserName(event.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          setUsername(newUsername);
        }}
      >
        update username
      </button>
    </div>
  );
};
