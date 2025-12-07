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

  const[houseExample, setHouseExample] = useState({
    state: "California",
    property_type: "All Residential",
    period_begin: "2021-01-01",
    period_end: "2022-02-01",
  });

  // GET requests
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const loadHouses = async (params) => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/houses", {
        params: {
          state: params.state,
          property_type: params.property_type,
          period_begin: params.period_begin,
          period_end: params.period_end,
          limit: 15,
        }
      });
      setHouses(res.data);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setHouses([]);
    }
  };

  useEffect(() => {
    loadHouses(houseExample);
  }, []);

  const handleHouseSearch = () => {
    const { state, property_type, period_begin, period_end } = houseExample;
    if (!state || !property_type || !period_begin || !period_end) {
      alert("Please fill out state, property type, and date range.");
      return;
    }
    loadHouses(houseExample);
  };

  // useEffect(() => {
  //   axios.get("http://127.0.0.1:5000/houses")
  //     .then((res) => setHouses(res.data))
  //     .catch((err) => console.error("Error fetching houses:", err));
  // }, []);






  return (
    <div
      style={{
        backgroundColor: "#F2EFDF",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      {/* NEW: User ID badge at top-right */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "10px 15px",
        backgroundColor: "#776b68ff",
        color: "white",
        borderRadius: "15px",
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        User ID: {localStorage.getItem("user_id")}
      </div>

      <h1 style={{color: "#493f3cff"}}>RobinSpot</h1>

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

        <button
          onClick={() => navigate("/favorite_report")}
          style={buttonStyle}
        >
          Favorite Reports Table
        </button>

        <button
          onClick={() => navigate("/price_ranking")}
          style={buttonStyle}
        >
          City Price Ranking
        </button>
        
        <button
          onClick={() => navigate("/show_metric")}
          style={buttonStyle}
        >
          Show Metric
        </button>
      </div>
      
      <div
      style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexDirection: "column",
          // backgroundColor: "white",
        }}
      >

        <h2 style={{ color: "#493f3cff", marginBottom: "0px", textAlign:"center" }}>Filter Houses</h2>
        <div
        style={{
          backgroundColor: "white",
          width: "82%",
          margin: "40px auto 0",
          padding: "50px",
          border: "2px solid White",
          borderRadius: "15px",
          textAlign: "left"
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>State</label>
          <input
            type="text"
            style={inputStyle}
            value={houseExample.state}
            onChange={(e) => setHouseExample({ ...houseExample, state: e.target.value })}
            placeholder="e.g., California"
          />

          <label>Property Type</label>
          <select
            style={inputStyle}
            value={houseExample.property_type}
            onChange={(e) => setHouseExample({ ...houseExample, property_type: e.target.value })}
          >
            <option value="All Residential">All Residential</option>
            <option value="Condo/Co-op">Condo/Co-op</option>
            <option value="Multi-Family (2-4 Unit)">Multi-Family (2-4 Unit)</option>
            <option value="Single Family Residential">Single Family Residential</option>
            <option value="Townhouse">Townhouse</option>
          </select>

          <label>Period Begin</label>
          <input
            type="date"
            style={inputStyle}
            value={houseExample.period_begin}
            onChange={(e) => setHouseExample({ ...houseExample, period_begin: e.target.value })}
            placeholder="YYYY-MM-DD"
          />

          <label>Period End</label>
          <input
            type="date"
            style={inputStyle}
            value={houseExample.period_end}
            onChange={(e) => setHouseExample({ ...houseExample, period_end: e.target.value })}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={handleHouseSearch} style={buttonStyle}>
            Search Houses
          </button>
        </div>
      </div>

        <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          justifyContent: "center",
          alignItems: "flex-start"
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
  fontSize: "20px",
  border: "2px solid #776b68ff",
  backgroundColor: "#776b68ff",
  color: "white",
  cursor: "pointer",
  borderRadius: "15px",
};

export default Home;