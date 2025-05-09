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
  getDocs,
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
  const [linkedIn, setLinkedIn] = useState("");
  const [resumeURL, setResume] = useState("");
  const [mediaURLs, setMedia] = useState([]);
  const [services, setServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
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
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleLinkedInChange = (e) => setLinkedIn(e.target.value);
  const handleResumeChange = (e) => setResume(e.target.value);
  const handleMediaChange = (index, value) => {
    const newMedia = [...mediaURLs];
    newMedia[index] = value;
    setMedia(newMedia);
  };

  const addMediaField = () => setMedia([...mediaURLs, ""]);
  const removeMediaField = (index) => {
    const newMedia = [...mediaURLs];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const saveProfileExtras = async () => {
    if (!linkedIn && !resumeURL && mediaURLs.every((url) => !url)) {
      alert("Please fill in at least one field.");
      return;
    }

    if (auth.currentUser) {
      try {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            linkedIn,
            resumeURL,
            mediaURLs: mediaURLs.filter((url) => url !== ""),
          },
          { merge: true }
        );
        alert("Profile extras saved!");
      } catch (error) {
        console.error("Error saving profile extras:", error);
        alert("Failed to save profile extras.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setDescription(data.description || "");
              setLinkedIn(data.linkedIn || "");
              setResume(data.resumeURL || "");
              setMedia(data.mediaURLs || [""]);
            }
          })
          .catch((error) => console.error("Error fetching profile:", error));
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
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services");
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServices(servicesList);

        const currentUser = auth.currentUser;
        if (currentUser) {
          const ownedServices = servicesList.filter(
            (service) => service.userId === currentUser.uid
          );
          setUserServices(ownedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [user]);

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

        <Link to="/" id="logo">
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
          <div className="profile-extras">
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={linkedIn}
              onChange={handleLinkedInChange}
            />
            <input
              type="text"
              placeholder="Resume URL"
              value={resumeURL}
              onChange={handleResumeChange}
            />
            {mediaURLs.map((url, i) => (
              <div key={i} className="media-url-input">
                <input
                  type="text"
                  placeholder={`Media URL ${i + 1}`}
                  value={url}
                  onChange={(e) => handleMediaChange(i, e.target.value)}
                />
                {mediaURLs.length > 1 && (
                  <button type="button" onClick={() => removeMediaField(i)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMediaField}>
              + Add Media URL
            </button>
            <button onClick={saveProfileExtras} className="save-button">
              Save
            </button>
            {mediaURLs.filter((url) => url).length > 0 && (
              <div className="media-preview">
                <h3>Media Preview</h3>
                <div className="media-grid">
                  {mediaURLs.map((url, i) => (
                    <div key={i} className="media-item">
                      <img
                        src={url}
                        alt={`Media ${i + 1}`}
                        onError={(e) => {
                          e.target.style.display = "none";
                          const link = document.createElement("a");
                          link.href = url;
                          link.textContent = url;
                          link.target = "_blank";
                          e.target.parentNode.appendChild(link);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="services">
            {user && userServices.length === 0 && (
              <div className="addservice">
                <button
                  className="addservicebtn"
                  onClick={() => setShowModal(true)}
                >
                  +
                </button>
                <h3>Add a Service</h3>
              </div>
            )}

            {user && userServices.length > 0 ? (
              <>
                <div className="service-header">
                  <h1 style={{ color: "seagreen" }}>Your Services</h1>
                  <div className="servicebtn">
                    <button
                      className="addservicebtn"
                      onClick={() => setShowModal(true)}
                    >
                      +
                    </button>
                  </div>
                </div>
                {userServices.map((service) => (
                  <div className="service-card" key={service.id}>
                    <strong>{service.title}</strong> {service.Sdescription} ($
                    {service.price})
                  </div>
                ))}
              </>
            ) : null}
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
