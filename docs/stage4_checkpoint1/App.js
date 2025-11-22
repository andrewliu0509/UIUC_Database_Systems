import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";


function App() {
  const [data, setData] = useState([]);
  const [housesExample, setHouses] = useState([]);
  const [user, setUser] = useState({user_name: "",user_id: "",user_password: ""});

  // GET
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/houses")
      .then((res) => {
        console.log("Fetched houses:", res.data);
        setHouses(res.data);
      })
      .catch((err) => console.error("Error fetching houses:", err));
  }, []);

  // ADD
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/add", user);

      // Extract user_id from backend response
      const newUserId = response.data.user_id;

      // Alert with user_id
      alert(`User added successfully! Your new user_id = ${newUserId}!`);
      
      // --- Clear input fields ---
      setUser({
        user_name: "",
        user_password: ""
      });
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
    
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>RobinSpot Database Demo</h2>

  
      <h3>House Data (First 1 rows):</h3>
      <div style={{ 
        maxHeight: "400px", 
        overflowY: "auto", 
        overflowX: "auto", 
        border: "2px solid pink"
        }}
      >
      
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Property Type</th>
            <th>Region ID</th>
            <th>Period Begin</th>
            <th>Period End</th>
            <th>Median Sale Price</th>
            <th>Median List Price</th>
            <th>Median PPSF</th>
            <th>Median List PPSF</th>
            <th>Homes Sold</th>
            <th>Sold above List</th>
            <th>Pending Sales</th>
            <th>New Listings</th>
            <th>Inventory</th>
            <th>Months of Supply</th>
            <th>Median DOM</th>
            <th>Off market in 2 weeks</th>
          </tr>
        </thead>
        <tbody>
          {housesExample.map((house, idx) => (
            <tr key={idx}>
              <td>{house.property_type}</td>
              <td>{house.region_id}</td>
              <td>{formatDate(house.period_begin)}</td>
              <td>{formatDate(house.period_end)}</td>
              <td>{house.median_sale_price}</td>
              <td>{house.median_list_price}</td>
              <td>{house.median_ppsf}</td>
              <td>{house.median_list_ppsf}</td>
              <td>{house.homes_sold}</td>
              <td>{house.sold_above_list}</td>
              <td>{house.pending_sales}</td>
              <td>{house.new_listings}</td>
              <td>{house.inventory}</td>
              <td>{house.months_of_supply}</td>
              <td>{house.median_dom}</td>
              <td>{house.off_market_in_two_weeks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <hr />

      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={user.user_name}
          onChange={(e) => setUser({ ...user, user_name: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.user_password}
          onChange={(e) => setUser({ ...user, user_password: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <MapContainer 
        center={[40.11, -88.24]}
        zoom={12}
        style={{ height: "500px", width: "50%", margin: "0 auto"}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>


    </div>

    
  );
}

export default App;
      
      