import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [reply, setReply] = useState({});

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const snap = await getDocs(collection(db, "enquiries"));
    setEnquiries(
      snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "enquiries", id), { status });
    fetchEnquiries();
  };

  const sendReply = async (id) => {
  if (!reply[id] || reply[id].trim() === "") {
    alert("Reply cannot be empty");
    return;
  }

  await updateDoc(doc(db, "enquiries", id), {
    adminReply: reply[id].trim(),
  });

  alert("Reply sent");
  setReply({ ...reply, [id]: "" });
  fetchEnquiries();
};



 return (
  <div className="admin-enqury"style={{
        minHeight: "94vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage:
          "url(/images/photo-1623742962105-faae8ad99f84.avif)",
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

    <div className="container">
    <h2>Customer Enquiries</h2>
    <div className="row">
      {enquiries.map((e) => (
        <div key={e.id} className="col-md-6 mb-3">
          <div className="card p-3 h-100">
            <h5>{e.carName}</h5>
            <p><b>Name:</b> {e.name}</p>
            <p><b>Email:</b> {e.email}</p>
            <p><b>Message:</b> {e.message}</p>

            <p>
              <b>Status:</b>{" "}
              <span className="text-capitalize">{e.status}</span>
            </p>

            <select
              className="form-select mb-2"
              value={e.status}
              onChange={(ev) => updateStatus(e.id, ev.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <textarea
              className="form-control mb-2"
              placeholder="Admin reply"
              value={reply[e.id] || e.adminReply || ""}
              onChange={(ev) =>
                setReply({ ...reply, [e.id]: ev.target.value })
              }
            />

            <button
              className="btn btn-dark"
              onClick={() => sendReply(e.id)}
            >
              Send Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  </div></div>
);

}
