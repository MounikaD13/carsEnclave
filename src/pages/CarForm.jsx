import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { uploadToCloudinary } from "../firebase/coludinary";

export default function CarForm() {
  const [car, setCar] = useState({ brand: "", model: "", price: "", year: "", stock: "", fuel: "" });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCar({ ...car, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const addUrlImage = () => {
    if (!urlInput.trim()) return;
    setPreviews(prev => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length && previews.length === 0) {
      alert("Please add at least one image");
      return;
    }

    try {
      setLoading(true);
      let uploadedImages = [];
      if (images.length) {
        uploadedImages = await Promise.all(images.map(file => uploadToCloudinary(file)));
      }
      const allImages = [...uploadedImages.map(img => img.secure_url), ...previews.slice(images.length)];

      await addDoc(collection(db, "cars"), {
        ...car,
        price: Number(car.price),
        year: Number(car.year),
        stock: Number(car.stock),
        images: allImages,
        createdAt: serverTimestamp(),
      });

      alert("Car added successfully 🚗");

      setCar({ brand: "", model: "", price: "", year: "", stock: "", fuel: "" });
      setImages([]);
      setPreviews([]);
      setUrlInput("");
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 bg-light p-4">
      {["brand", "model", "price", "year", "stock", "fuel"].map((field) => (
        <div className="col-md-5" key={field}>
          <input className="form-control" name={field} placeholder={field.toUpperCase()} value={car[field]} onChange={handleChange} required />
        </div>
      ))}

      <div className="col-12 mb-2">
        <input type="file" className="form-control mb-2" multiple accept="image/*" onChange={handleImages} />
        <div className="d-flex gap-2 mb-2">
          <input type="text" className="form-control" placeholder="Enter image URL" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
          <button type="button" className="btn btn-outline-dark" onClick={addUrlImage}>Add URL</button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-2">
        {previews.map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={src} alt="preview" width="120" style={{ borderRadius: "8px" }} />
          </div>
        ))}
      </div>

      <button className="btn btn-dark mt-3" disabled={loading}>{loading ? "Uploading..." : "Add Car"}</button>
    </form>
  );
}
