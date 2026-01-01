import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AdminRoute({ children }) {
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            if (!user) {
                setAllowed(false);
                return;
            }

            const snap = await getDoc(doc(db, "users", user.uid));
            setAllowed(snap.exists() && snap.data().role === "admin");
        };

        checkAdmin();
    }, []);

    if (allowed === null) return <p>Loading...</p>;
    return allowed ? children : <Navigate to="/" />;
}
