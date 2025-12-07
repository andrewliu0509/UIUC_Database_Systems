import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

function ShowMetric() {
  const navigate = useNavigate();

  const QUERY_TYPES = [
    "median_sale_price",
    "median_list_price",
    "median_ppsf",
    "median_list_ppsf",
    "homes_sold",
    "new_listings",
    "inventory",
  ];
  const PROPERTY_TYPES = [
    "All Residential",
    "Condo/Co-op",
    "Multi-Family (2-4 Unit)",
    "Single Family Residential",
    "Townhouse",
  ];
  const VIS_TYPES = ["line", "bar"];
  const LOCATION_TYPES = [
    { label: "City", value: "city" }, 
    { label: "State", value: "state" },
    { label: "Parent Metro Region", value: "metro" },
  ];

  const [form, setForm] = useState({
    period_begin: "",
    period_end: "",
    location_type: "state",
    location_value: "",
    property_type: "All Residential",
    query_type: "median_sale_price",
    vis_type: "line",
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const {
      period_begin,
      period_end,
      location_type,
      location_value,
      property_type,
      query_type,
    } = form;

    if (!period_begin || !period_end || !location_type || !location_value || !property_type || !query_type) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/show_metric", {
        period_begin,
        period_end,
        location_type,
        location_value,
        property_type,
        query_type,
      });

      setRows(response.data || []);
    } catch (err) {
      console.error("ShowMetric error:", err);
      alert("Failed to fetch metric data. Check inputs or backend.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationField = (row) => {
    if (form.location_type === "state") return row.us_state;
    if (form.location_type === "metro") return row.parent_metro_region;
    return row.region; 
  };

  const getMetricValue = (row) => row?.[form.query_type];

  const chartData = useMemo(() => {
    return (rows || [])
      .map((r) => ({
        period_begin: r.period_begin,
        period_end: r.period_end,
        location: getLocationField(r),
        property_type: r.property_type,
        value: getMetricValue(r),
      }))
      .filter((d) => d.period_begin && d.value !== null && d.value !== undefined);
  }, [rows, form.location_type, form.query_type]);
  
  return (
    <div
      style={{
        backgroundColor: "#F2EFDF",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Show Metric
      </h1>

      <button
        onClick={() => navigate("/app")}
        style={{ ...buttonStyle }}
      >
        Back to Home
      </button>
      <div
        style={{
          backgroundColor: "white",
          width: "82%",
          margin: "40px auto 0",
          padding: "50px",
          border: "2px solid black",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Form:</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>Period Begin</label>
          <input
            type="text"
            style={inputStyle}
            value={form.period_begin}
            onChange={(e) => setForm({ ...form, period_begin: e.target.value })}
            placeholder="yyyy/mm/dd"
          />

          <label>Period End</label>
          <input
            type="text"
            style={inputStyle}
            value={form.period_end}
            onChange={(e) => setForm({ ...form, period_end: e.target.value })}
            placeholder="yyyy/mm/dd"
          />

          <label>Location Type</label>
          <select
            style={inputStyle}
            value={form.location_type}
            onChange={(e) => setForm({ ...form, location_type: e.target.value })}
          >
            {LOCATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <label>Location Value</label>
          <input
            type="text"
            style={inputStyle}
            value={form.location_value}
            onChange={(e) => setForm({ ...form, location_value: e.target.value })}
            placeholder={
              form.location_type === "state"
                ? "e.g., Illinois"
                : form.location_type === "metro"
                ? "e.g., Chicago-Naperville-Elgin"
                : "Champaign-IL"
            }
          />

          <label>Property Type</label>
          <select
            style={inputStyle}
            value={form.property_type}
            onChange={(e) => setForm({ ...form, property_type: e.target.value })}
          >
            {PROPERTY_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label>Metric</label>
          <select
            style={inputStyle}
            value={form.query_type}
            onChange={(e) => setForm({ ...form, query_type: e.target.value })}
          >
            {QUERY_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label>Visualization</label>
          <select
            style={inputStyle}
            value={form.vis_type}
            onChange={(e) => setForm({ ...form, vis_type: e.target.value })}
          >
            {VIS_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
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
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          width: "82%",
          margin: "30px auto 0",
          padding: "30px",
          border: "2px solid black",
          height: "420px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Chart:</h2>

        <div style={{ width: "100%", height: "340px" }}>
          <ResponsiveContainer>
            {form.vis_type === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid />
                <XAxis dataKey="period_begin" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid />
                <XAxis dataKey="period_begin" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          margin: "30px auto 0",
          maxHeight: "400px",
          overflowY: "auto",
          border: "2px solid #555",
          backgroundColor: "white",
        }}
      >
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>period_begin</th>
              <th>period_end</th>
              <th>location</th>
              <th>property_type</th>
              <th>{form.query_type}</th>
            </tr>
          </thead>
          <tbody>
            {chartData.length > 0 ? (
              chartData.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.period_begin}</td>
                  <td>{r.period_end}</td>
                  <td>{r.location}</td>
                  <td>{r.property_type}</td>
                  <td>{r.value}</td>
                </tr>
              ))
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

export default ShowMetric;
