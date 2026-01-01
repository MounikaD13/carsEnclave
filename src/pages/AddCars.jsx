// import { collection, addDoc } from "../firebase/firebase/firestore";
// import { db } from "../firebase/firebase";
// import { useState } from "react";

// export default function AdminAddCar() {
//   const [brand, setBrand] = useState("");
//   const [model, setModel] = useState("");
//   const [price, setPrice] = useState("");

//   const addCar = async () => {
//     await addDoc(collection(db, "cars"), {
//       brand,
//       model,
//       price,
//       available: true
//     });
//     alert("Car Added");
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Add Car</h2>
//       <input className="form-control mb-2" placeholder="Brand" onChange={(e)=>setBrand(e.target.value)} />
//       <input className="form-control mb-2" placeholder="Model" onChange={(e)=>setModel(e.target.value)} />
//       <input className="form-control mb-2" placeholder="Price" onChange={(e)=>setPrice(e.target.value)} />
//       <button className="btn btn-dark" onClick={addCar}>Add</button>
//     </div>
//   );
// }
import React from 'react'

export default function AddCars() {
  return (
    <div>
      
    </div>
  )
}
