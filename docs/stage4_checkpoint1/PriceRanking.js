import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function PriceRanking() {
  const [form, setForm] = useState({
    city: "",
    state: "",
    property_type_id: "-1",
    period_start: "",
    period_end: "",
    metric: "sales_price",
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const { city, state, property_type_id, period_start, period_end } = form;

    if (!city || !state || !property_type_id || !period_start || !period_end) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/price_ranking", {
        city: form.city,
        state: form.state,
        property_type_id: Number(form.property_type_id),
        period_start: form.period_start,
        period_end: form.period_end,
        metric: form.metric,
      });

      setResult(response.data);
    } catch (err) {
      console.error("Ranking error:", err);
      alert("Failed to fetch ranking. Check inputs or backend.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F2EFDF",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "30px" }}>
        City Price Ranking
      </h1>
      <button
          onClick={() => navigate("/app")}
          style={{...buttonStyle}}
        >
          Home Page
        </button>
      <div
        style={{
          backgroundColor: "white",
          width: "82%",
          margin: "40px auto 0",
          padding: "50px",
          border: "2px solid white",
          borderRadius: "15px",
        }}
      >
        {/* <h2 style={{ marginBottom: "20px" }}>Form:</h2> */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>City</label>
          <input
            type="text"
            style={inputStyle}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="e.g., Fremont"
          />

          <label>State</label>
          <input
            type="text"
            style={inputStyle}
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            placeholder="e.g., California"
          />

          <label>Property Type</label>
          <select
            style={inputStyle}
            value={form.property_type_id}
            onChange={(e) => setForm({ ...form, property_type_id: e.target.value })}
          >
            <option value={-1}>All Residential</option>
            <option value={3}>Condo/Co-op</option>
            <option value={4}>Multi-Family (2-4 Unit)</option>
            <option value={6}>Single Family Residential</option>
            <option value={13}>Townhouse</option>
          </select>

          <label>Period Begin</label>
          <input
            type="date"
            style={inputStyle}
            value={form.period_start}
            onChange={(e) => setForm({ ...form, period_start: e.target.value })}
            // placeholder="yyyy/mm/dd"
          />

          <label>Period End</label>
          <input
            type="date"
            style={inputStyle}
            value={form.period_end}
            onChange={(e) => setForm({ ...form, period_end: e.target.value })}
            // placeholder="yyyy/mm/dd"
          />

          <label>Metric</label>
          <select
            style={inputStyle}
            value={form.metric}
            onChange={(e) => setForm({ ...form, metric: e.target.value })}
          >
            <option value="sales_price">sales_price</option>
            <option value="list_price">list_price</option>
            <option value="spread">spread</option>
            <option value="sales_volume">sales_volume</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <button onClick={handleSearch} style={buttonStyle}>
            Search
          </button>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          margin: "40px auto 0",
          padding: "20px",
          // border: "2px solid #555",
          backgroundColor: "white",
          borderRadius: "15px",
        }}
      >
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Metric Value</th>
              <th>Rank in State</th>
              <th>Total Cities in State</th>
              <th>Rank in Nation</th>
              <th>Total Cities in Nation</th>
            </tr>
          </thead>
          <tbody>
            {result ? (
              <tr>
                <td>{result.metric_value}</td>
                <td>{result.rank_in_state}</td>
                <td>{result.total_cities_in_state}</td>
                <td>{result.rank_in_nation}</td>
                <td>{result.total_cities_in_nation}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                  No result.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  border: "2px solid #776b68ff",
  backgroundColor: "#776b68ff",
  color: "white",
  cursor: "pointer",
  whiteSpace: "nowrap",
  borderRadius: "15px",
};
export default PriceRanking;
