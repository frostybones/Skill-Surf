import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
export const Signin = () => {
  return (
    <div className="signin">
      <div className="header1">
        <Link to="/skillsurf" id="logo">
          <h1 id="logo">
            Skill<span style={{ color: "seagreen" }}>Surf</span>
          </h1>
        </Link>
        <h1>
          <Link to="/signup" id="signin2">
            signup
          </Link>
        </h1>
      </div>
      <div className="container">
        <div className="signinbox">
          <h1>Log In</h1>
          <div className="signinform">
            <b>username: </b>
            <input type="text" placeholder="username" />
            <br />
            <b>password: </b>
            <input type="password" placeholder="password" />
            <br />
            <input type="submit" value="Log In" />
          </div>
        </div>
      </div>
    </div>
  );
};
