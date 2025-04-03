import { ChangeProfile } from "../Changeprofile";
import { useContext } from "react";
import { AppContext } from "../App";

export const Profile = (props) => {
  const { username } = useContext(AppContext);
  return (
    <div>
      user:{username}
      <ChangeProfile />
    </div>
  );
};
