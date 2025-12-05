import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_name: "",
    user_password: "",
    user_password_confirm: "",
    agree: false,
  });

  const handleSubmit = async () => {
    if (!user.agree) {
      alert("You must agree to the policy.");
      return;
    }

    if (user.user_password !== user.user_password_confirm) {
      alert("Passwords do not match!");
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(user.user_password)) {
      if (user.user_password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      if (!/[a-z]/.test(user.user_password)) {
        alert("Password must contain at least one lowercase letter.");
        return;
      }

      if (!/[A-Z]/.test(user.user_password)) {
        alert("Password must contain at least one uppercase letter.");
        return;
      }

      if (!/\d/.test(user.user_password)) {
        alert("Password must contain at least one number.");
        return;
      }

      if (!/[@$!%*?&#]/.test(user.user_password)) {
        alert("Password must contain at least one special character (@$!%*?&#).");
        return;
      }
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/signup", {
        user_name: user.user_name,
        user_password: user.user_password,
      });

      const newUserId = response.data.user_id;
      alert(`User added successfully! Your new user_id = ${newUserId}`);

      // Clear input fields
      setUser({
        user_name: "",
        user_password: "",
        user_password_confirm: "",
        agree: false,
      });

      // Navigate to login page
      navigate("/");
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
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
        <h1 style={{ marginBottom: "40px" }}>Welcome to RobinSpot</h1>

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

          <label>Confirm password</label>
          <input
            type="password"
            style={inputStyle}
            value={user.user_password_confirm}
            onChange={(e) =>
              setUser({ ...user, user_password_confirm: e.target.value })
            }
          />

          <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
            <input
              type="checkbox"
              checked={user.agree}
              onChange={(e) => setUser({ ...user, agree: e.target.checked })}
              style={{ width: "20px", height: "20px" }}
            />
            <span style={{ marginLeft: "10px" }}>Agree to policy</span>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                width: "150px",
                padding: "10px",
                fontSize: "16px",
                border: "2px solid black",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
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

export default SignUp;
