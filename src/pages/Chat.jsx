import "../styles/Chat.css";

// export default function CarHome() {
//   return (
//     <>
//       <section className="py-5">
//         <div className="container">
//           <h2 className="text-center text-white fw-bold mb-4">What Our Customers Say</h2>
//           <div className="row g-4">

//             <div className="col-md-4">
//               <div className="card p-3 text-center" style={{backgroundColor:"aliceblue"}}>
//                 <p>"Amazing service and great car options!"</p>
//                 <h6>- Rahul</h6>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div className="card p-3 text-center" style={{backgroundColor:"aliceblue"}} >
//                 <p>"Best place to buy luxury cars."</p>
//                 <h6>- Sneha</h6>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div className="card p-3 text-center" style={{backgroundColor:"aliceblue"}}>
//                 <p>"Smooth process and transparent pricing."</p>
//                 <h6>- Arjun</h6>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>


//       {/* Footer */}
//       <footer className="bg-dark text-white text-center py-3">
//         © 2025 CarsEnclave | All Rights Reserved
//       </footer>
//     </>
//   );
// }
import React from "react";

const testimonials = [
  { id: 1, text: "Amazing service and great car options!", name: "Vaani" },
  { id: 2, text: "Best place to buy luxury cars.", name: "Krish" },
  { id: 3, text: "Smooth process and transparent pricing.", name: "Sri" },

];

const Testimonials = () => {
  return (
    <>
      <section className="py-5 test">
        <div className="container">
          <h2 className="text-center text-white fw-bold mb-4">What Our Customers Say</h2>
          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-md-4 col-sm-6">
                <div className="testimonial-card-2 p-4 position-relative">
                  <i className="bi bi-quote fs-4 text-info"></i>
                  <p className="mt-0 text-white ">"{testimonial.text}"</p>
                  <h6 className="mt-0 text-white">- {testimonial.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        © 2025 CarsEnclave | All Rights Reserved
      </footer>
    </>

  );
};

export default Testimonials;

