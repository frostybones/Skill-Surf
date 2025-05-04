import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Signup } from "./skill surf/signup";
import { Signin } from "./skill surf/signin";
import HamburgerMenu from "./components/hamburgermenu";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const SkillSurf = () => {
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPhotoURL(user.photoURL);
      } else {
        setPhotoURL(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) return <p>Loading user info...</p>;

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
        <Link to="/profile" id="profile">
          <img src={photoURL} className="profile-image"></img>
        </Link>
      </div>
    </div>
  );
};
