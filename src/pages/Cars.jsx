import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/Cars.css";
import { Link } from "react-router-dom";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000000);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 8;

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snap = await getDocs(collection(db, "cars"));
        const carData = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // ensure numeric values
          price: Number(doc.data().price),
          year: Number(doc.data().year),
          stock: Number(doc.data().stock),
          images: doc.data().images || [],
        }));
        setCars(carData);
        setBrands([...new Set(carData.map((car) => car.brand))]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("");
    setSelectedYear(null);
    setMinPrice(0);
    setMaxPrice(200000000);
    setCurrentPage(1);
  };

  // Filtered cars
  const filteredCars = cars.filter(
    (car) =>
      `${car.brand} ${car.model}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      car.price >= minPrice &&
      car.price <= maxPrice &&
      (selectedBrand ? car.brand === selectedBrand : true) &&
      (selectedYear ? car.year === selectedYear : true)
  );

  useEffect(() => setCurrentPage(1), [search, selectedBrand, selectedYear, minPrice, maxPrice]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div className="container-fluid my-5 ">
      <div className="row">

        {/* DESKTOP FILTER */}
        <div className="col-md-3 d-none d-md-block">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: "80px", zIndex: 900, backgroundColor: "#e6edec" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filters</h5>
              <button className="btn btn-sm btn-info" onClick={resetFilters}>Reset</button>
            </div>

            <label className="fw-semibold">Min Price (₹)</label>
            <input type="number" className="form-control mb-3" placeholder="0" onChange={(e) => setMinPrice(Number(e.target.value || 0))} />

            <label className="fw-semibold">Max Price (₹)</label>
            <input type="number" className="form-control mb-3" placeholder="200000000" onChange={(e) => setMaxPrice(Number(e.target.value || 200000000))} />

            <h6 className="fw-bold mt-3">Brands</h6>
            <div className="d-flex flex-wrap gap-2">
              <button className={`btn btn-sm ${selectedBrand === "" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setSelectedBrand("")}>All</button>
              {brands.map((brand) => (
                <button key={brand} className={`btn btn-sm ${selectedBrand === brand ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setSelectedBrand(brand)}>
                  {brand}
                </button>
              ))}
            </div>

            <h6 className="fw-bold mt-4">Year</h6>
            <div className="year-slider">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>2020</span> <span>2026</span>
              </div>
              <input
                type="range"
                min="2020"
                max="2026"
                step="1"
                value={selectedYear || 2020} // default to 2020 for slider
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="form-range"
              />
              <div className="text-center fw-semibold mt-2">
                Selected Year: {selectedYear !== null ? selectedYear : "All"}
              </div>
              <button className="btn btn-sm btn-outline-dark w-100 mt-2" onClick={() => setSelectedYear(null)}>
                All Years
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-9">
          {/* MOBILE SEARCH + FILTER */}
          <div className="d-flex gap-2 align-items-center mb-3 d-md-none px-2">
            <input className="form-control" placeholder="SEARCH...." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-light" onClick={() => setShowMobileFilter(true)}><i className="bi bi-funnel"></i></button>
            <button className="btn btn-sm btn-info" onClick={resetFilters}>Reset</button>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="d-none d-md-block">
            <label className="fw-bold ms-md-5 text-white" style={{ fontSize: "1.4rem" }}>Search</label>
            <input className="form-control mb-3 w-75 ms-md-5" placeholder="model" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading && <p>Loading cars...</p>}

          <div className="row g-4">
            <h2 className="ms-md-5 mb-0 text-white w-75">Explore Our Cars</h2>
            {currentCars.map((car) => (
              <div className="col-md-5 ms-md-5" key={car.id}>
                <Link to={`/car/${car.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card h-100 shadow-sm car-card" style={{ backgroundColor: "#bebdbf" }}>
                    <div className="img-container">
                      <img
                        src={car.images?.[0] || "/no-car.png"}
                        className="card-img-top"
                        alt={car.model}
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{car.brand}</h5>
                          <h4 className="fw-bold mb-1">{car.model}</h4>
                        </div>
                        <h5 className="mt-2 text-dark">
                          ₹{(car.price / 100000).toFixed(2)} L
                          <br />
                          <small className="text-muted">Ex-showroom</small>
                        </h5>
                      </div>
                      {car.stock === 0 && <span className="badge bg-light text-dark">Preorders </span>}
                      {car.stock >0 && <span className="badge bg-dark ">Test Drive <i className="fa-solid fa-check"></i></span>}
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {!loading && filteredCars.length === 0 && <p className="text-center">No cars found</p>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>&laquo;</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>&raquo;</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER OFFCANVAS */}
      {showMobileFilter && (
        <div className="offcanvas offcanvas-start show d-md-none" style={{ visibility: "visible", background: "#fff" }}>
          <div className="offcanvas-header">
            <h5>Filters</h5>
            <button className="btn-close" onClick={() => setShowMobileFilter(false)}></button>
          </div>
          <div className="offcanvas-body">
            <label className="fw-semibold">Min Price (₹)</label>
            <input type="number" className="form-control mb-3" placeholder="0" onChange={(e) => setMinPrice(Number(e.target.value || 0))} />
            <label className="fw-semibold">Max Price (₹)</label>
            <input type="number" className="form-control mb-3" placeholder="200000000" onChange={(e) => setMaxPrice(Number(e.target.value || 200000000))} />
            <h6 className="fw-bold mt-3">Brands</h6>
            <div className="d-flex flex-wrap gap-2">
              <button className={`btn btn-sm ${selectedBrand === "" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setSelectedBrand("")}>All</button>
              {brands.map((brand) => (
                <button key={brand} className={`btn btn-sm ${selectedBrand === brand ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setSelectedBrand(brand)}>{brand}</button>
              ))}
            </div>
            <h6 className="fw-bold mt-4">Year</h6>
            <div className="year-slider">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>2020</span> <span>2026</span>
              </div>
              <input
                type="range"
                min="2020"
                max="2026"
                step="1"
                value={selectedYear || 2020} // default to 2020 for slider
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="form-range"
              />
              <div className="text-center fw-semibold mt-2">
                Selected Year: {selectedYear !== null ? selectedYear : "All"}
              </div>
              <button className="btn btn-sm btn-outline-dark w-100 mt-2" onClick={() => setSelectedYear(null)}>
                All Years
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}