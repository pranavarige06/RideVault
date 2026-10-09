import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8080/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":
              "Basic " + btoa(email + ":" + password)
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const result = await response.text();

      console.log("Backend response:", result);

      if (result === "Login successful") {

        localStorage.setItem(
          "ridevaultAuth",
          btoa(email + ":" + password)
        );

        navigate("/dashboard");

      } else {

        alert(
          "Wrong credentials. Please check your email and password."
        );

      }

    } catch (error) {

      console.log("Login error:", error);

      alert("Unable to connect to the backend.");

    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🚗
        </div>

        <h1>RideVault</h1>

        <p className="login-subtitle">
          Vehicle Rental & Management System
        </p>

        <h2>Welcome Back</h2>

        <p className="login-description">
          Login to access your dashboard
        </p>

        <div className="login-form">

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Login
          </button>

        </div>

        <p className="login-footer">
          Secure access to RideVault
        </p>

      </div>

    </div>
  );
}

export default Login;