import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {

    const auth = localStorage.getItem("ridevaultAuth");

    try {

      const response = await fetch(
        "http://localhost:8080/vehicles",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }

      const data = await response.json();

      setVehicles(data);

    } catch (error) {

      console.log(
        "Error loading vehicles:",
        error
      );

    }
  }

  async function addVehicle() {

    if (
      !brand ||
      !model ||
      !year ||
      !pricePerDay ||
      !transmission ||
      !fuelType
    ) {
      alert("Please fill all fields.");
      return;
    }

    const auth = localStorage.getItem("ridevaultAuth");

    const newVehicle = {
      brand: brand,
      model: model,
      year: Number(year),
      pricePerDay: Number(pricePerDay),
      transmission: transmission,
      fuelType: fuelType,
      available: true
    };

    try {

      const response = await fetch(
        "http://localhost:8080/vehicles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + auth
          },

          body: JSON.stringify(newVehicle)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      const data = await response.json();

      setVehicles([
        ...vehicles,
        data
      ]);

      clearForm();

      alert("Vehicle added successfully!");

    } catch (error) {

      console.log(
        "Error adding vehicle:",
        error
      );

      alert("Failed to add vehicle.");
    }
  }

  function editVehicle(vehicle) {

    setEditingId(vehicle.id);

    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setPricePerDay(vehicle.pricePerDay);

    setTransmission(
      vehicle.transmission || ""
    );

    setFuelType(
      vehicle.fuelType || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function updateVehicle() {

    if (
      !brand ||
      !model ||
      !year ||
      !pricePerDay ||
      !transmission ||
      !fuelType
    ) {
      alert("Please fill all fields.");
      return;
    }

    const auth = localStorage.getItem("ridevaultAuth");

    const existingVehicle =
      vehicles.find(
        (vehicle) =>
          vehicle.id === editingId
      );

    const updatedVehicle = {
      brand: brand,
      model: model,
      year: Number(year),
      pricePerDay: Number(pricePerDay),
      transmission: transmission,
      fuelType: fuelType,

      available: existingVehicle
        ? existingVehicle.available
        : true
    };

    try {

      const response = await fetch(
        `http://localhost:8080/vehicles/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + auth
          },

          body: JSON.stringify(updatedVehicle)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update vehicle"
        );
      }

      const data =
        await response.json();

      setVehicles(
        vehicles.map(
          (vehicle) =>
            vehicle.id === editingId
              ? data
              : vehicle
        )
      );

      setEditingId(null);

      clearForm();

      alert(
        "Vehicle updated successfully!"
      );

    } catch (error) {

      console.log(
        "Error updating vehicle:",
        error
      );

      alert(
        "Failed to update vehicle."
      );
    }
  }

  function cancelEdit() {

    setEditingId(null);

    clearForm();
  }

  function clearForm() {

    setBrand("");
    setModel("");
    setYear("");
    setPricePerDay("");
    setTransmission("");
    setFuelType("");
  }

  async function deleteVehicle(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      );

    if (!confirmDelete) {
      return;
    }

    const auth =
      localStorage.getItem(
        "ridevaultAuth"
      );

    try {

      const response = await fetch(
        `http://localhost:8080/vehicles/${id}`,
        {
          method: "DELETE",

          headers: {
            "Authorization":
              "Basic " + auth
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete vehicle"
        );
      }

      const result =
        await response.text();

      console.log(
        "Delete response:",
        result
      );

      setVehicles(
        vehicles.filter(
          (vehicle) =>
            vehicle.id !== id
        )
      );

      alert(
        "Vehicle deleted successfully!"
      );

    } catch (error) {

      console.log(
        "Error deleting vehicle:",
        error
      );

      alert(
        "Failed to delete vehicle."
      );
    }
  }


  // ========================================
  // VEHICLE SEARCH
  // ========================================

  const filteredVehicles =
    vehicles.filter((vehicle) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return (
        vehicle.brand
          .toLowerCase()
          .includes(search) ||

        vehicle.model
          .toLowerCase()
          .includes(search) ||

        (vehicle.transmission || "")
          .toLowerCase()
          .includes(search) ||

        (vehicle.fuelType || "")
          .toLowerCase()
          .includes(search)
      );

    });


  return (

    <div className="management-page">

      <div className="management-header">

        <div>

          <h1>
            🚗 Vehicle Management
          </h1>

          <p>
            Manage all vehicles available
            in RideVault.
          </p>

        </div>

        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </div>


      {/* ========================================
          ADD / EDIT VEHICLE
      ======================================== */}

      <div className="vehicle-form-card">

        <h2>
          {editingId
            ? "✏️ Edit Vehicle"
            : "➕ Add New Vehicle"}
        </h2>


        <div className="vehicle-form">

          <div className="form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              placeholder="e.g. Toyota"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Model
            </label>

            <input
              type="text"
              placeholder="e.g. Fortuner"
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Year
            </label>

            <input
              type="number"
              placeholder="e.g. 2025"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Price Per Day
            </label>

            <input
              type="number"
              placeholder="e.g. 4000"
              value={pricePerDay}
              onChange={(e) =>
                setPricePerDay(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Transmission
            </label>

            <select
              value={transmission}
              onChange={(e) =>
                setTransmission(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Transmission
              </option>

              <option value="Manual">
                Manual
              </option>

              <option value="Automatic">
                Automatic
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Fuel Type
            </label>

            <select
              value={fuelType}
              onChange={(e) =>
                setFuelType(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Fuel Type
              </option>

              <option value="Petrol">
                Petrol
              </option>

              <option value="Diesel">
                Diesel
              </option>

              <option value="CNG">
                CNG
              </option>

              <option value="Electric">
                Electric
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

            </select>

          </div>

        </div>


        <div className="form-buttons">

          {editingId ? (

            <>

              <button
                className="update-button"
                onClick={updateVehicle}
              >
                Update Vehicle
              </button>

              <button
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            </>

          ) : (

            <button
              className="add-button"
              onClick={addVehicle}
            >
              Add Vehicle
            </button>

          )}

        </div>

      </div>


      {/* ========================================
          VEHICLE LIST
      ======================================== */}

      <div className="vehicle-list-section">

        <div className="section-heading">

          <h2>
            Available Vehicles
          </h2>

          <span className="vehicle-count">

            {filteredVehicles.length}

            {" "}

            vehicle
            {filteredVehicles.length !== 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* SEARCH */}

        <div className="vehicle-search">

          <input
            type="text"
            placeholder="🔍 Search by brand, model, transmission or fuel type..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>


        {filteredVehicles.length === 0 ? (

          <div className="empty-state">

            <div>
              🚗
            </div>

            <h3>
              No Vehicles Found
            </h3>

            <p>

              {searchTerm
                ? "Try a different search."
                : "Add your first vehicle using the form above."}

            </p>

          </div>

        ) : (

          <div className="vehicle-grid">

            {filteredVehicles.map(
              (vehicle) => (

                <div
                  className="vehicle-card"
                  key={vehicle.id}
                >

                  <div className="vehicle-card-top">

                    <div className="vehicle-icon">
                      🚗
                    </div>

                    <span
                      className={
                        vehicle.available
                          ? "status available"
                          : "status rented"
                      }
                    >

                      {vehicle.available
                        ? "Available"
                        : "Rented"}

                    </span>

                  </div>


                  <h3>
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </h3>


                  <p className="vehicle-year">
                    Model Year: {vehicle.year}
                  </p>


                  <div className="vehicle-specs">

                    <div className="vehicle-spec">

                      <span>
                        ⚙️
                      </span>

                      <div>

                        <small>
                          Transmission
                        </small>

                        <strong>
                          {vehicle.transmission ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>


                    <div className="vehicle-spec">

                      <span>
                        ⛽
                      </span>

                      <div>

                        <small>
                          Fuel Type
                        </small>

                        <strong>
                          {vehicle.fuelType ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>

                  </div>


                  <div className="vehicle-price">

                    <span>
                      ₹{vehicle.pricePerDay}
                    </span>

                    <small>
                      / day
                    </small>

                  </div>


                  <div className="vehicle-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editVehicle(vehicle)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteVehicle(
                          vehicle.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Vehicles;