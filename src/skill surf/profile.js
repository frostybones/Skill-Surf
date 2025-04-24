import { Link } from "react-router-dom";
import HamburgerMenu from "../components/hamburgermenu";

export const Profile = (props) => {
  return (
    <div className="profile">
      <div className="navbar">
        <div className="ham">
          <HamburgerMenu />
        </div>

        <Link to="/skillsurf" id="logo">
          <h1 id="logo">
            Skill<span style={{ color: "seagreen" }}>Surf</span>
          </h1>
        </Link>
      </div>
      <div className="profilebox"></div>
    </div>
  );
};
