import { useContext } from "react";
import { AppContext } from "../App";

export const Home = (props) => {
  const { username } = useContext(AppContext);
  return <h1>this is the home page and the user is: {username}</h1>;
};
