import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/firebase";

export default function UserEnquiries() {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchMyEnquiries(currentUser.uid);
            }
        });

        return () => unsub();
    }, []);

    const fetchMyEnquiries = async (uid) => {
        const q = query(
            collection(db, "enquiries"),
            where("userId", "==", uid)
        );

        const snap = await getDocs(q);
        setEnquiries(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
    };

    return (

        <div style={{
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
                    background: "rgba(0, 0, 0, 0.3)",

                }}
            />

            <h2 className="mt-4 mb-3 mx-5 text-white" >My Enquiries</h2>

            <div className="row mx-4">
                {enquiries.length === 0 && <p>No enquiries yet</p>}

                {enquiries.map((e) => (
                    <div key={e.id} className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100" style={{ backgroundColor: " rgba(235, 250, 252, 0.63)" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>{e.carName}</h5>
                                    <span className={`badge ${e.status === "pending" ? "bg-warning" : e.status === "rejected" ? "bg-danger" : "bg-success"
                                        }`} style={{ padding: "10px", fontSize: "0.9rem" }}>
                                        {e.status}
                                    </span>
                                </div>

                                <p className="mt-3">
                                    <b>Your Message:</b><br />
                                    {e.message}
                                </p>

                                {e.adminReply && (
                                    <div className="alert alert-secondary mt-3">
                                        <b>Admin Reply</b>
                                        <p className="mb-0">{e.adminReply}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
