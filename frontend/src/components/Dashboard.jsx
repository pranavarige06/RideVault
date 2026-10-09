import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [vehicleCount, setVehicleCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [availableVehicleCount, setAvailableVehicleCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {

    const auth = localStorage.getItem("ridevaultAuth");

    try {

      const vehicleResponse = await fetch(
        "http://localhost:8080/vehicles",
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

      const rentalResponse = await fetch(
        "http://localhost:8080/rentals",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );

      if (
        !vehicleResponse.ok ||
        !customerResponse.ok ||
        !rentalResponse.ok
      ) {
        throw new Error("Failed to load dashboard data");
      }

      const vehicles = await vehicleResponse.json();
      const customers = await customerResponse.json();
      const rentals = await rentalResponse.json();

      setVehicleCount(vehicles.length);
      setCustomerCount(customers.length);
      setRentalCount(rentals.length);

      setAvailableVehicleCount(
        vehicles.filter(
          (vehicle) => vehicle.available
        ).length
      );

    } catch (error) {

      console.log(
        "Error loading dashboard:",
        error
      );

    }
  }

  function logout() {

    localStorage.removeItem("ridevaultAuth");

    navigate("/login");

  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <div>

          <h1 className="logo">
            🚗 RideVault
          </h1>

          <p className="tagline">
            Vehicle Rental & Management System
          </p>

        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        <h2>
          Dashboard
        </h2>

        <p className="welcome-text">
          Welcome to RideVault. Manage your
          vehicles, customers and rentals
          from one place.
        </p>

        {/* DASHBOARD STATISTICS */}

        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              🚗
            </div>

            <div>
              <span>
                Total Vehicles
              </span>

              <strong>
                {vehicleCount}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>
                Customers
              </span>

              <strong>
                {customerCount}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>
              <span>
                Rentals
              </span>

              <strong>
                {rentalCount}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <span>
                Available
              </span>

              <strong>
                {availableVehicleCount}
              </strong>
            </div>

          </div>

        </div>

        {/* DASHBOARD MANAGEMENT CARDS */}

        <div className="dashboard-cards">

          <Link
            to="/vehicles"
            className="dashboard-card"
          >

            <div className="card-icon">
              🚗
            </div>

            <h3>
              Vehicles
            </h3>

            <p>
              Add, update and manage rental
              vehicles.
            </p>

            <span>
              Manage Vehicles →
            </span>

          </Link>

          <Link
            to="/customers"
            className="dashboard-card"
          >

            <div className="card-icon">
              👤
            </div>

            <h3>
              Customers
            </h3>

            <p>
              Manage customer information
              and details.
            </p>

            <span>
              Manage Customers →
            </span>

          </Link>

          <Link
            to="/rentals"
            className="dashboard-card"
          >

            <div className="card-icon">
              📋
            </div>

            <h3>
              Rentals
            </h3>

            <p>
              Create and manage vehicle
              rentals.
            </p>

            <span>
              Manage Rentals →
            </span>

          </Link>

        </div>

      </main>

      <footer className="dashboard-footer">

        <p>
          © 2026 RideVault |
          Vehicle Rental & Management System
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;