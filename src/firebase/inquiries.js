import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const addInquiry = async (data) => {
  return addDoc(collection(db, "inquiries"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "pending",
  });
};
