import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Vehicles from "./components/Vehicles";
import Customers from "./components/Customers";
import Rentals from "./components/Rentals";

function ProtectedRoute({ children }) {

  const auth = localStorage.getItem("ridevaultAuth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Vehicles */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* Rentals */}
        <Route
          path="/rentals"
          element={
            <ProtectedRoute>
              <Rentals />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;