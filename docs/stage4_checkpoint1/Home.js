import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './App.css';
import MapView from "./MapView";
import HouseTable from "./HouseTable";




function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [houses, setHouses] = useState([]);
  const [user, setUser] = useState({ user_name: "", user_password: "" });

  // GET requests
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/houses")
      .then((res) => setHouses(res.data))
      .catch((err) => console.error("Error fetching houses:", err));
  }, []);






  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>RobinSpot Database Demo</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => navigate("/user_reports")}
          style={buttonStyle}
        >
          User Reports Table
        </button>
      </div>

      <div
      style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >

        {houses.length == 0? <p>No house data found for this query</p>:
        <>
          <HouseTable houses={houses} />
          <MapView houses={houses} />
        </>
        }
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

export default Home;
