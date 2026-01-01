import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    license: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        address: form.address,
        drivingLicense: form.license,
        role: "customer",
        createdAt: serverTimestamp()
      });

      alert("Registration successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        contact: "",
        address: "",
        license: ""
      });
    } catch (error) {
      alert(error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1623742962105-faae8ad99f84?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1607144113358-9d8dd893a647?q=80&w=1063&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,

        }}
      />
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 2,
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
      <h3 className="text-center mb-4">Customer Registration</h3>

      <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            name="license"
            placeholder="Driving License Number"
            value={form.license}
            onChange={handleChange}
            required
          />


          <input
            className="form-control mb-2"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "registering in..." : "Register"}
          </button>
 
      </form>
      <p className="text-center mt-3">
           Already Have An Account?{" "}
          <Link to="/login" className="text-warning fw-semibold" >
            Login</Link>
        </p>
      </div>
    </div>
  );
}
