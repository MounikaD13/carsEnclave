import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "mounika13.d@gmail.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      let role;

      if (!snap.exists()) {
        role = user.email === ADMIN_EMAIL ? "admin" : "customer";
        await setDoc(docRef, {
          email: user.email,
          role,
          createdAt: serverTimestamp()
        });
      } else {
        role = snap.data().role;
      }

      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-bg d-flex align-items-center justify-content-center"
      style={{
        minHeight: "94vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage:
          "url(/images/pexels-photo-26578524.jpeg)",
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
          background: "rgba(0,0,0,0.65)",

        }}
      />

      {/* Login Card */}
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 2,
          borderRadius: "16px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <h3 className="text-center mb-4 fw-bold">Welcome Back</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-dark w-100 py-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-warning fw-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
