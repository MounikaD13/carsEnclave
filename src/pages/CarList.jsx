import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../firebase/coludinary";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch cars
  const fetchCars = async () => {
    const snap = await getDocs(collection(db, "cars"));
    setCars(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Delete car
  const deleteCar = async id => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      await deleteDoc(doc(db, "cars", id));
      fetchCars();
    }
  };

  // Start editing a car
  const startEdit = car => {
    setEditingCar({ ...car });
    setImageFiles([]);
    setImageUrls(car.images || []);
    setUrlInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Input change
  const handleChange = e => {
    const { name, value } = e.target;
    setEditingCar(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleImages = e => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    setImageUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  // Add image via URL
  const addUrlImage = () => {
    if (urlInput.trim() === "") return;
    setImageUrls(prev => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  // Remove image
  const removeImage = index => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    const numExisting = editingCar.images ? editingCar.images.length : 0;
    if (index >= numExisting) {
      const fileIndex = index - numExisting;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    } else {
      setEditingCar(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setUploading(true);

      let uploadedImages = [];
      if (imageFiles.length) {
        uploadedImages = await Promise.all(
          imageFiles.map(file => uploadToCloudinary(file))
        );
      }

      const updatedData = {
        price: Number(editingCar.price),
        stock: Number(editingCar.stock),
        images: [
          ...(editingCar.images || []), // existing remaining images
          ...uploadedImages.map(img => img.secureUrl), // newly uploaded
          ...imageUrls.slice(editingCar.images ? editingCar.images.length : 0) // URLs added manually
        ]
      };

      await updateDoc(doc(db, "cars", editingCar.id), updatedData);

      setCars(prev =>
        prev.map(car =>
          car.id === editingCar.id ? { ...car, ...updatedData } : car
        )
      );

      setEditingCar(null);
      setImageFiles([]);
      setImageUrls([]);
      setUrlInput("");
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div>
      <h4 className="mb-3">Cars Avaliable</h4>

      {/* EDIT FORM */}
      {editingCar && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Edit Car</h5>
            <div className="row g-3">
              {/* Brand & Model (disabled) */}
              {["brand", "model","fuel"].map(field => (
                <div className="col-md-3" key={field}>
                  <label>{field.toUpperCase()}</label>
                  <input
                    className="form-control"
                    value={editingCar[field]}
                    disabled
                  />
                </div>
              ))}

              {/* Price & Stock */}
              {["price", "stock"].map(field => (
                <div className="col-md-3" key={field}>
                  <label>{field.toUpperCase()}</label>
                  <input
                    type="number"
                    name={field}
                    className="form-control"
                    value={editingCar[field]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {/* Image upload */}
              <div className="col-12">
                <label>Upload Images</label>
                <input
                  type="file"
                  className="form-control mb-2"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                />

                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                  />
                  <button type="button" className="btn btn-dark" onClick={addUrlImage}>
                    Add URL
                  </button>
                </div>

                {/* Image previews */}
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {imageUrls.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        display: "inline-block", // makes parent fit image exactly
                        borderRadius: "8px",     // optional: round corners
                        overflow: "hidden",      // ensures button doesn't overflow parent
                      }}
                    >
                      <img
                        src={src}
                        alt="preview"
                        style={{
                          display: "block",
                          width: "200px",        // image width
                          borderRadius: "8px",   // same as parent
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: "4px",           // small offset from top
                          right: "4px",         // small offset from right
                          border: "none",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          padding: 0,
                          lineHeight: "24px",
                          textAlign: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="mt-3">
              <button
                className="btn btn-success me-2"
                onClick={saveChanges}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingCar(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cars table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Price</th>
              <th>Year</th>
              <th>Stock</th>
              <th>Fuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.price}</td>
                <td>{car.year}</td>
                <td>{car.stock}</td>
                <td>{car.fuel}</td>
                <td>
                  <button
                    className="btn btn-outline-dark btn-sm me-2"
                    onClick={() => startEdit(car)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger mt-1 mt-lg-0 btn-sm"
                    onClick={() => deleteCar(car.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
