import { Link } from "react-router-dom";
import HamburgerMenu from "../components/hamburgermenu";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const Profile = (props) => {
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [Sdescription, setSDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        title,
        Sdescription,
        price,
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid,
      });
      alert("Service added!");
      setShowModal(false);
      setTitle("");
      setSDescription("");
      setPrice("");
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchDescription = async () => {
          const docRef = doc(db, "users", user.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setDescription(docSnap.data().description || "");
              console.log("Fetched description:", docSnap.data().description);
            } else {
              console.log("No description found for this user.");
            }
          } catch (error) {
            console.error("Error fetching description:", error);
          }
        };
        fetchDescription();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDescription = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDescription(docSnap.data().description || "");
            console.log("Fetched description:", docSnap.data().description);
          } else {
            console.log("No description found for this user.");
          }
        } catch (error) {
          console.error("Error fetching description:", error);
        }
      }
    };
    fetchDescription();
  }, []);

  const handleDescriptionChange = (e) => {
    console.log("Description updated:", e.target.value);
    setDescription(e.target.value);
  };
  const saveDescription = async () => {
    console.log("Save button clicked");
    if (auth.currentUser) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      try {
        await setDoc(docRef, { description }, { merge: true });
        alert("Description saved!");
      } catch (error) {
        console.error("Error saving description:", error);
        alert("Failed to save description. Please try again.");
      }
    } else {
      alert("You must be logged in to save your description.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setShowPopup(true);
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
  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/signin");
  };

  if (!user && !showPopup) return null;

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
      {showPopup ? (
        <div className="popup-overlay">
          <div className="popup-conten">
            <h2>Please log in to access this page.</h2>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="profilebox">
            <div>
              <img
                src={
                  user?.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="pfp"
              ></img>

              <h1>{auth.currentUser?.displayName}</h1>
            </div>
            <div className="description">
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a description about yourself..."
                className="description-input"
              ></textarea>
              <button onClick={saveDescription} className="save-button">
                Save Description
              </button>
            </div>
          </div>
          <div className="services">
            <div className="addservice">
              <button onClick={() => setShowModal(true)}>+</button>
              <p>Add service</p>
            </div>
          </div>
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <h2>Add a New Service</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Service Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={Sdescription}
                    onChange={(e) => setSDescription(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
