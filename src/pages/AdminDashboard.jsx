import CarForm from "./CarForm";
import CarList from "./CarList";
import { useState } from "react";


export default function AdminDashboard() {
  const [selectedCarId, setSelectedCarId] = useState(null);
  return (
    <div className="container">
    <h2 className="mb-4">Add Cars</h2>
    {!selectedCarId ? <CarForm /> : <EditCar carId={selectedCarId} onClose={() => setSelectedCarId(null)} />}
    <hr />
    <CarList onEdit={setSelectedCarId} />
  </div>
  );
}
