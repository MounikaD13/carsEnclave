import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/CarDetails.css";
import CarImageCarousel from './CarImageCarousel'

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [expandCarousel, setExpandCarousel] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      const snap = await getDoc(doc(db, "cars", id));
      if (snap.exists()) setCar({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 BLOCK IF NOT LOGGED IN
    if (!user) {
      alert("Please login or register to submit an enquiry");
      navigate("/register");
      return;
    }

    await addDoc(collection(db, "enquiries"), {
      carId: id,
      carName: `${car.brand} ${car.model}`,
      userId: user.uid,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      date: form.date,
      status: "pending",
      adminReply: "",                       // ✅ REQUIRED
      createdAt: serverTimestamp(),
    });

    alert("Enquiry sent successfully!");
    setShowEnquiry(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div style={{
      minHeight: "94vh",
      overflow: "hidden",
      position: "relative",
      backgroundImage:
        "url(https://images.pexels.com/photos/10386396/pexels-photo-10386396.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}
    >
      <div className="car-detail-card">
        {/* LEFT - Carousel */}
        <div className="car-carousel">
          <CarImageCarousel images={car.images} />

          {/* Expand */}
          <button
            className="expand-btn"
            onClick={() => setExpandCarousel(true)}
          >
            ⛶
          </button>
        </div>

        {/* RIGHT - Details */}
        <div className="car-info">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">{car.brand}</h5>
              <h2 className="fw-bold mb-1">{car.model}</h2>
            </div>
            <h5 className="mt-2 text-dark">
              ₹{(car.price / 100000).toFixed(2)} L
              <br />
              <small className="text-muted">Ex-showroom</small>
            </h5>
          </div>
          <div className="specs">
            Fuel:<h5>{car.fuel}</h5>
            Year:<h5>{car.year}</h5>
          </div>
         <div className="mb-3">
           {car.stock === 0 && <span className="badge bg-info text-dark">Preorders </span>}
          {car.stock >0 && <span className="badge bg-info text-dark">Test Drive <i class="fa-solid fa-check"></i></span>}
         </div>

          <button
            className="enquire-btn"
            onClick={() => {
              if (!user) {
                alert("Please login or register to enquire");
                navigate("/login");
              } else {
                setShowEnquiry(!showEnquiry);
              }
            }}
          >
            {user ? "Enquire" : "Login to Enquire"}
          </button>
        </div>
      </div>

      {/* ENQUIRY FORM */}
      {showEnquiry && (
        <div className="enquiry-section">
          <h3>Enquire about {car.brand} {car.model}</h3>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button type="submit">Send Enquiry</button>
          </form>
        </div>
      )}

      {/* EXPANDED CAROUSEL */}
      {expandCarousel && (
        <div
          className="carousel-modal"
          onClick={() => setExpandCarousel(false)}
        >
          <button
            className="close-btn"
            onClick={() => setExpandCarousel(false)}
          >
            ✕
          </button>

          <div
            className="modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel showThumbs infiniteLoop showStatus={false}>
              {car.images.map((img, i) => (
                <img key={i} src={img} alt="car" />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}
