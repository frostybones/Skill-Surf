import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Signup } from "./skill surf/signup";
import { Signin } from "./skill surf/signin";
import HamburgerMenu from "./components/hamburgermenu";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const SkillSurf = () => {
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services");
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
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
        {user && (
          <button
            id="logout-button"
            onClick={() => {
              signOut(auth)
                .then(() => {
                  console.log("User signed out");
                })
                .catch((error) => {
                  console.error("Error signing out: ", error);
                });
            }}
          >
            Logout
          </button>
        )}
        {!user && (
          <>
            <Link to="/signup" id="signup">
              Signup
            </Link>
            <Link to="/signin" id="signin">
              Log In
            </Link>
          </>
        )}

        <Link to="/profile">
          <img
            src={
              user?.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="profile-image"
            alt=""
          />
        </Link>
      </div>
      <div className="webservices">
        {services.map((service) => (
          <li key={service.id}>
            <strong>{service.title}</strong> - {service.description} ($
            {service.price})
          </li>
        ))}
      </div>
    </div>
  );
};
