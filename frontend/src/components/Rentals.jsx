import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Rentals() {

  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);


  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    const auth = localStorage.getItem("ridevaultAuth");

    try {

      const rentalResponse = await fetch(
        "http://localhost:8080/rentals",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );

      const customerResponse = await fetch(
        "http://localhost:8080/customers",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );

      const vehicleResponse = await fetch(
        "http://localhost:8080/vehicles",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );


      if (
        !rentalResponse.ok ||
        !customerResponse.ok ||
        !vehicleResponse.ok
      ) {

        throw new Error(
          "Failed to load data"
        );

      }


      const rentalData =
        await rentalResponse.json();

      const customerData =
        await customerResponse.json();

      const vehicleData =
        await vehicleResponse.json();


      setRentals(rentalData);

      setCustomers(customerData);

      setVehicles(vehicleData);

    } catch (error) {

      console.log(
        "Error loading rental data:",
        error
      );

    }
  }


  // ========================================
  // CALCULATE TOTAL PRICE
  // ========================================

  useEffect(() => {

    if (
      !vehicleId ||
      !startDate ||
      !endDate
    ) {

      setTotalPrice(0);

      return;
    }


    const selectedVehicle =
      vehicles.find(
        (vehicle) =>
          vehicle.id === Number(vehicleId)
      );


    if (!selectedVehicle) {

      setTotalPrice(0);

      return;
    }


    const start =
      new Date(startDate);

    const end =
      new Date(endDate);


    const difference =
      end.getTime() -
      start.getTime();


    const days =
      Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
      );


    if (days <= 0) {

      setTotalPrice(0);

      return;
    }


    const total =
      days *
      selectedVehicle.pricePerDay;


    setTotalPrice(total);

  }, [
    vehicleId,
    startDate,
    endDate,
    vehicles
  ]);


  // ========================================
  // ADD RENTAL
  // ========================================

  async function addRental() {

    if (
      !customerId ||
      !vehicleId ||
      !startDate ||
      !endDate
    ) {

      alert(
        "Please fill all fields."
      );

      return;
    }


    if (totalPrice <= 0) {

      alert(
        "Please select valid dates."
      );

      return;
    }


    const selectedVehicle =
      vehicles.find(
        (vehicle) =>
          vehicle.id === Number(vehicleId)
      );


    if (!selectedVehicle) {

      alert(
        "Vehicle not found."
      );

      return;
    }


    if (!selectedVehicle.available) {

      alert(
        "This vehicle is already rented."
      );

      return;
    }


    const auth =
      localStorage.getItem(
        "ridevaultAuth"
      );


    const newRental = {

      customerId:
        Number(customerId),

      vehicleId:
        Number(vehicleId),

      startDate:
        startDate,

      endDate:
        endDate,

      totalPrice:
        totalPrice

    };


    try {

      const response =
        await fetch(
          "http://localhost:8080/rentals",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                "Basic " + auth
            },

            body:
              JSON.stringify(
                newRental
              )
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to add rental"
        );

      }


      const data =
        await response.json();


      setRentals([
        ...rentals,
        data
      ]);


      setVehicles(
        vehicles.map(
          (vehicle) =>
            vehicle.id ===
            Number(vehicleId)
              ? {
                  ...vehicle,
                  available: false
                }
              : vehicle
        )
      );


      clearForm();


      alert(
        "Rental created successfully!"
      );

    } catch (error) {

      console.log(
        "Error adding rental:",
        error
      );

      alert(
        "Failed to create rental."
      );

    }
  }


  // ========================================
  // CLEAR FORM
  // ========================================

  function clearForm() {

    setCustomerId("");

    setVehicleId("");

    setStartDate("");

    setEndDate("");

    setTotalPrice(0);

  }


  // ========================================
  // DELETE RENTAL
  // ========================================

  async function deleteRental(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this rental?"
      );


    if (!confirmDelete) {

      return;

    }


    const auth =
      localStorage.getItem(
        "ridevaultAuth"
      );


    try {

      const response =
        await fetch(
          `http://localhost:8080/rentals/${id}`,
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
          "Failed to delete rental"
        );

      }


      setRentals(
        rentals.filter(
          (rental) =>
            rental.id !== id
        )
      );


      const vehicleResponse =
        await fetch(
          "http://localhost:8080/vehicles",
          {
            headers: {
              "Authorization":
                "Basic " + auth
            }
          }
        );


      const vehicleData =
        await vehicleResponse.json();


      setVehicles(vehicleData);


      alert(
        "Rental deleted successfully!"
      );

    } catch (error) {

      console.log(
        "Error deleting rental:",
        error
      );

      alert(
        "Failed to delete rental."
      );

    }
  }


  // ========================================
  // GET CUSTOMER NAME
  // ========================================

  function getCustomerName(
    customerId
  ) {

    const customer =
      customers.find(
        (customer) =>
          customer.id === customerId
      );


    return customer
      ? customer.name
      : `Customer #${customerId}`;

  }


  // ========================================
  // GET VEHICLE NAME
  // ========================================

  function getVehicleName(
    vehicleId
  ) {

    const vehicle =
      vehicles.find(
        (vehicle) =>
          vehicle.id === vehicleId
      );


    return vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : `Vehicle #${vehicleId}`;

  }


  // ========================================
  // FORMAT DATE
  // ========================================

  function formatDate(date) {

    if (!date) {
      return "";
    }


    const formattedDate =
      new Date(
        date + "T00:00:00"
      );


    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="management-page">


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="management-header">

        <div>

          <h1>
            📋 Rental Management
          </h1>

          <p>
            Create and manage vehicle rentals.
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
          ADD RENTAL FORM
      ======================================== */}

      <div className="rental-form-card">

        <h2>
          ➕ Create New Rental
        </h2>


        <div className="rental-form">


          <div className="form-group">

            <label>
              Customer
            </label>

            <select
              value={customerId}
              onChange={(e) =>
                setCustomerId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Customer
              </option>


              {customers.map(
                (customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>

                )
              )}

            </select>

          </div>



          <div className="form-group">

            <label>
              Vehicle
            </label>

            <select
              value={vehicleId}
              onChange={(e) =>
                setVehicleId(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Vehicle
              </option>


              {vehicles
                .filter(
                  (vehicle) =>
                    vehicle.available
                )
                .map(
                  (vehicle) => (

                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.brand}{" "}
                      {vehicle.model} - ₹
                      {vehicle.pricePerDay}
                      /day
                    </option>

                  )
                )}

            </select>

          </div>



          <div className="form-group">

            <label>
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
            />

          </div>



          <div className="form-group">

            <label>
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
            />

          </div>

        </div>



        {/* PRICE */}

        <div className="rental-price-box">

          <div>

            <span>
              Total Rental Price
            </span>

            <small>
              Automatically calculated
            </small>

          </div>


          <strong>
            ₹{totalPrice}
          </strong>

        </div>



        {/* BUTTONS */}

        <div className="form-buttons">

          <button
            className="add-button"
            onClick={addRental}
          >
            Create Rental
          </button>


          <button
            className="cancel-button"
            onClick={clearForm}
          >
            Clear
          </button>

        </div>

      </div>



      {/* ========================================
          RENTAL LIST
      ======================================== */}

      <div className="rental-list-section">


        <div className="section-heading">

          <h2>
            Current Rentals
          </h2>


          <span className="rental-count">

            {rentals.length} rental
            {rentals.length !== 1
              ? "s"
              : ""}

          </span>

        </div>



        {rentals.length === 0 ? (

          <div className="empty-state">

            <div>
              📋
            </div>

            <h3>
              No Rentals Found
            </h3>

            <p>
              Create your first rental
              using the form above.
            </p>

          </div>

        ) : (

          <div className="rental-grid">

            {rentals.map(
              (rental) => (

                <div
                  className="rental-card"
                  key={rental.id}
                >


                  <div className="rental-card-top">

                    <div className="rental-icon">
                      📋
                    </div>


                    <span className="rental-status">
                      Active
                    </span>

                  </div>



                  <h3>
                    Rental #{rental.id}
                  </h3>



                  <div className="rental-detail">

                    <span>
                      👤
                    </span>

                    <div>

                      <small>
                        Customer
                      </small>

                      <strong>
                        {getCustomerName(
                          rental.customerId
                        )}
                      </strong>

                    </div>

                  </div>



                  <div className="rental-detail">

                    <span>
                      🚗
                    </span>

                    <div>

                      <small>
                        Vehicle
                      </small>

                      <strong>
                        {getVehicleName(
                          rental.vehicleId
                        )}
                      </strong>

                    </div>

                  </div>



                  <div className="rental-dates">

                    <div>

                      <small>
                        Start Date
                      </small>

                      <strong>
                        {formatDate(
                          rental.startDate
                        )}
                      </strong>

                    </div>


                    <div>

                      <small>
                        End Date
                      </small>

                      <strong>
                        {formatDate(
                          rental.endDate
                        )}
                      </strong>

                    </div>

                  </div>



                  <div className="rental-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{rental.totalPrice}
                    </strong>

                  </div>



                  <button
                    className="delete-button rental-delete-button"
                    onClick={() =>
                      deleteRental(
                        rental.id
                      )
                    }
                  >
                    Delete Rental
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default Rentals;