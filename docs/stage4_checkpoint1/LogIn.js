import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogIn() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    user_name: "",
    user_password: "",
  });

  const handleLogin = async () => {
    if (!user.user_name || !user.user_password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        user_name: user.user_name,
        user_password: user.user_password,
      });

      if (response.data.success) {
        alert("Login successful!");
        navigate("/app");
      } else {
        alert("Incorrect username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F2EFDF",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "40px" }}>Login to your account</h1>

        <div style={{ width: "350px", margin: "0 auto", textAlign: "left" }}>
          <label>User name</label>
          <input
            type="text"
            style={inputStyle}
            value={user.user_name}
            onChange={(e) =>
              setUser({ ...user, user_name: e.target.value })
            }
          />

          <label>Password</label>
          <input
            type="password"
            style={inputStyle}
            value={user.user_password}
            onChange={(e) =>
              setUser({ ...user, user_password: e.target.value })
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {/* Login Button */}
            <button
              onClick={handleLogin}
              style={buttonStyle}
            >
              Login
            </button>

            {/* Signup button */}
            <button
              onClick={() => navigate("/signup")}
              style={buttonStyle}
            >
              Sign up
            </button>
          </div>
        </div>

        <p style={{ marginTop: "40px", fontSize: "12px", color: "#555" }}>
          *simple background with same color scheme as main page
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "20px",
  border: "2px solid black",
  backgroundColor: "transparent",
  fontSize: "16px",
};

const buttonStyle = {
  width: "120px",
  padding: "10px",
  fontSize: "16px",
  border: "2px solid black",
  backgroundColor: "transparent",
  cursor: "pointer",
};

export default LogIn;
