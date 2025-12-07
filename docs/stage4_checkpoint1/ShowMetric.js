import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import {v4 as uuidv4} from "uuid";

function ShowMetric() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

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
    period_begin: "2021-01-01",
    period_end: "2022-10-28",
    location_type: "state",
    location_value: "",
    property_type: "All Residential",
    query_type: "median_sale_price",
    vis_type: "line",
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSearchReport, setSelectedSearchReport] = useState([]);
  const [selectedFavReport, setSelectedFavReport] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState([]);

  const handleSelectSearch = (id) => {
    if (selectedSearchReport.includes(id)) {
      setSelectedSearchReport(selectedSearchReport.filter(item => item !== id));
    } else {
      setSelectedSearchReport([...selectedSearchReport, id]);
    }
  };

  const handleSelectFav = (id) => {
    if (selectedFavReport.includes(id)) {
      setSelectedFavReport(selectedFavReport.filter(item => item !== id));
    } else {
      setSelectedFavReport([...selectedFavReport, id]);
    }
  };

  const handleSelectDraw = (id) => {
    if (selectedDraw.includes(id)) {
      setSelectedDraw(selectedDraw.filter(item => item !== id));
    } else {
      setSelectedDraw([...selectedDraw, id]);
    }
  };

  const loadFavorite = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/favorite_query", {
                params: { user_id: user_id },
            });
            setReports(response.data);
        } catch (err) {
            console.error("Error loading favorite reports:", err);
        }
    };

    useEffect(() => {
        loadFavorite();
    }, []);

  const dateFormat = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  const handleFavorite = async () => {
    if (selectedSearchReport.length === 0) {
      alert("No reports selected to add to favorites.");
      return;
    }
    const select = rows.filter(r => selectedSearchReport.includes(r.id));
    try {
      for (const s of select) {
        const data = {
          user_id: user_id,
          period_begin: dateFormat(s.period_begin),
          period_end: dateFormat(s.period_end),
          location_type: form.location_type,
          location_value: form.location_value,
          property_type_id: form.property_type,
          query_type: form.query_type,
          vis_type: form.vis_type,
        };

        const response = await axios.post("http://127.0.0.1:5000/favorite_query", data);
        if (response.data.status === "successfully insert") {
          alert("Reports added to favorites successfully.");
          loadFavorite();
        }
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to add reports to favorites.");
    }
  };

  const handleDelete = async () => {
    if (selectedFavReport.length === 0) {
      alert("No favorite reports selected to delete.");
      return;
    }
    try {
      const response = await axios.delete("http://127.0.0.1:5000/favorite_query", {
        data: {
          query_id: selectedFavReport,
        },
      });
      if (response.data.status === "successfully delete") {
        alert("Favorite reports deleted successfully.");
        loadFavorite();
      }
    } catch (error) {
      console.error("Error deleting favorite reports:", error);
      alert("Failed to delete favorite reports.");
    }
  };

  const handleSearch = async () => {
    const {
      period_begin,
      period_end,
      location_type,
      location_value,
      property_type,
      query_type,
      vis_type,
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

      setRows((response.data || []).map((r) => ({
        ...r,
        id: uuidv4(),
      })));
    } catch (err) {
      console.error("ShowMetric error:", err);
      alert("Failed to fetch metric data. Check inputs or backend.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDraw = async () => {
    if (selectedDraw.length === 0) {
      alert("No favorite reports selected to draw.");
      return;
    }

    const report = reports.filter(r => selectedDraw.includes(r.query_id));
    let p_begin = dateFormat(report[0].period_begin);
    let p_end = dateFormat(report[0].period_end);
    for (const i of report) {
      if (report[0].location_type !== i.location_type ||
          report[0].location_value !== i.location_value ||
          report[0].property_type_id !== i.property_type_id ||
          report[0].query_type !== i.query_type) {
        alert("Please select favorite reports with the same parameters to draw.");
        return;
      }
      if (dateFormat(i.period_begin) < p_begin) {
        p_begin = dateFormat(i.period_begin);
      }
      if (dateFormat(i.period_end) > p_end) {
        p_end = dateFormat(i.period_end);
      }
    }
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/show_metric", {
        period_begin: p_begin,
        period_end: p_end,
        location_type: report[0].location_type,
        location_value: report[0].location_value,
        property_type: report[0].property_type_id,
        query_type: report[0].query_type,
      });
      if (response.data.length === 0) {
        alert("Failed to draw.");
      }
      setRows((response.data || []).map((r) => ({
        ...r,
        id: uuidv4(),
      })));

    } catch (error) {
      console.error("Error drawing favorite reports:", error);
      alert("Failed to draw favorite reports.");
      setRows([]);
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
        id: r.id,
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
      <h1 style={{ color:"#493f3cff", textAlign: "center", marginBottom: "30px" }}>
        Show Metric
      </h1>

      <button
        onClick={() => navigate("/app")}
        style={{ ...buttonStyle }}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>Period Begin</label>
          <input
            type="date"
            style={inputStyle}
            value={form.period_begin}
            onChange={(e) => setForm({ ...form, period_begin: e.target.value })}
            placeholder="yyyy/mm/dd"
          />

          <label>Period End</label>
          <input
            type="date"
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
      
      <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>Chart</h2>
      <div
        style={{
          backgroundColor: "white",
          width: "82%",
          margin: "30px auto 0",
          padding: "30px",
          border: "2px solid white",
          height: "420px",
          borderRadius: "15px",
        }}
      >
        {/* <h2 style={{ marginBottom: "10px", color:"#493f3cff" }}>Chart</h2> */}

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

      <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>Searching Result</h2>
      <div
        style={{
          width: "90%",
          margin: "30px auto 0",
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
              <th>period_begin</th>
              <th>period_end</th>
              <th>location</th>
              <th>property_type</th>
              <th>{form.query_type}</th>
              <th>Select to Add to Favorite</th>
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
                  <td>
                      <input
                      type="checkbox"
                      checked={selectedSearchReport.includes(r.id)}
                      onChange={() => handleSelectSearch(r.id)}
                      />
                  </td>
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
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "25px",
            }}
        >
        {/* Add button */}
        <button
            onClick={handleFavorite}
            style={buttonStyle}
        >
        Add
        </button>
        
      </div>

      <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>My Favorite queries</h2>
      <div
      style={{
          width: "90%",
          margin: "40px auto 0",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "15px",
          // border: "2px solid #555",
      }}
      >
        {/* show favorite report */}
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
            <tr>
            <th>Query ID</th>
            {/* <th>User ID</th> */}
            <th>Period Begin</th>
            <th>Period End</th>
            <th>Location Type</th>
            <th>Location Value</th>
            <th>Property Type ID</th>
            <th>Query Type</th>
            <th>Visualization Type</th>
            <th>Data Type</th>
            <th>Select to Delete</th>
            <th>Select to Draw</th>
            </tr>
        </thead>
        <tbody>
            {reports.map((report) => (
            <tr key={report.query_id}>
                <td>{report.query_id }</td>
                {/* <td>{report.user_id}</td> */}
                <td>{report.period_begin }</td>
                <td>{report.period_end }</td>
                <td>{report.location_type}</td>
                <td>{report.location_value}</td>
                <td>{report.property_type_id}</td>
                <td>{report.query_type}</td>
                <td>{report.visualization_type}</td>
                <td>{report.data_type}</td>
                <td>
                    <input
                    type="checkbox"
                    checked={selectedFavReport.includes(report.query_id)}
                    onChange={() => handleSelectFav(report.query_id)}
                    />
                </td>
                <td>
                    <input
                    type="checkbox"
                    checked={selectedDraw.includes(report.query_id)}
                    onChange={() => handleSelectDraw(report.query_id)}
                    />
                </td>
            </tr>
            ))}
        </tbody>
        </table>
      </div>
      <div
          style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "25px",
          }}
      >
      {/* delete button */}
      <button
          onClick={handleDelete}
          style={buttonStyle}
      >
      Delete
      </button>
      {/* draw button */}
      <button
          onClick={handleDraw}
          style={buttonStyle}
      >
      Draw
      </button>
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
