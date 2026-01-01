import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getCarById = async (id) => {
  const carRef = doc(db, "cars", id);
  const carSnap = await getDoc(carRef);
  if (!carSnap.exists()) throw new Error("Car not found");
  return { id: carSnap.id, ...carSnap.data() };
};
