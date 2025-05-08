import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import HamburgerMenu from "../components/hamburgermenu";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useQuery = () => new URLSearchParams(useLocation().search);

export const SearchResults = () => {
  const query = useQuery().get("query") || "";
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchingServices = async () => {
      const allServicesSnapshot = await getDocs(collection(db, "services"));
      const allServices = allServicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matched = allServices.filter((service) =>
        service.title.toLowerCase().includes(query.toLowerCase())
      );

      setResults(matched);
    };

    fetchMatchingServices();
  }, [query]);
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
    <div className="search-results">
      <div className="navbar">
        <div className="ham">
          <HamburgerMenu />
        </div>

        <Link to="/" id="logo">
          <h1 id="logo">
            Skill<span style={{ color: "seagreen" }}>Surf</span>
          </h1>
        </Link>
        <Link to="/profile">
          <img
            src={
              user?.photoURL && user.photoURL !== "null"
                ? user.photoURL
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="profile-image"
          />
        </Link>
      </div>

      <div>
        <h2>Search Results for "{query}"</h2>
        {results.length === 0 ? (
          <p>No matching services found.</p>
        ) : (
          <div className="services">
            {results.map((service) => (
              <div className="service-card">
                <li key={service.id}>
                  <strong>{service.title}</strong> {service.Sdescription} ($
                  {service.price})
                </li>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
