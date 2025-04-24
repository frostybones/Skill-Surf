import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Signup } from "./skill surf/signup";
import { Signin } from "./skill surf/signin";
import HamburgerMenu from "./components/hamburgermenu";
export const SkillSurf = () => {
  return (
    <div className="skillsurf">
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin></Signin>} />
      </Routes>

      <div className="navbar">
        <div className="ham">
          <HamburgerMenu />
        </div>
        <h1 id="logo">
          Skill<span style={{ color: "seagreen" }}>Surf</span>
        </h1>
        <Link to="/signup" id="signup">
          Signup
        </Link>
        <Link to="/signin" id="signin">
          Log In
        </Link>
      </div>
    </div>
  );
};
