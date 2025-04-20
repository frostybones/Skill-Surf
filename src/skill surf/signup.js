import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { SkillSurf } from "../skillsurf";
export const Signup = () => {
  return (
    <div className="mainsignup">
      <div className="signup">
        <div className="header1">
          <Link to="/skillsurf" id="logo">
            <h1 id="logo">
              Skill<span style={{ color: "seagreen" }}>Surf</span>
            </h1>
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="signupbox">
          <h1>create your account</h1>
        </div>
      </div>
    </div>
  );
};
