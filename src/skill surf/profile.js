import { Link } from "react-router-dom";
import HamburgerMenu from "../components/hamburgermenu";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const Profile = (props) => {
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
      <div className="profilebox">
        <div>
          <img src={photoURL}></img>

          <h1>{auth.currentUser?.displayName}</h1>
        </div>
      </div>
    </div>
  );
};
