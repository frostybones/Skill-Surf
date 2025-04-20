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
      </div>
    </div>
  );
};
