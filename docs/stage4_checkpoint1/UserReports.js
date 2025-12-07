import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserReports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    report_id: "",
    city: "",
    state:"",
    property_type: "All Residential",
    sold_price: "",
    list_price: "",
    list_time: "",
    sold_time: "",
    square_feet: "",
  });
  const [selectedReport, setSelectedReport] = useState([]);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");

  const reload = async () => {
    try{
      const response = await axios.get("http://127.0.0.1:5000/user_reports", {
        params: {user_id: user_id },
      });
      setReports(response.data);
    } catch (err) {
      console.error("Error fetching user reports:", err);
    }
  };

  useEffect(() => {
    reload();
  }, [user_id]);

  const handleInsert = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/user_reports", {
        ...form,
        user_id: user_id,
      });

      if (response.data.status === "successfully insert") {
        alert("Report inserted successfully!");
        await reload();
      }
      else if (response.data.status === "failed to insert due to lacking fields") {
        alert("Failed to insert. Please fill out every field.");
      }
    } catch (err) {
        console.error("Insert error:", err);
        alert("Insert Failed.");
    }
  };

  const handleUpdate = async () => {
    if (!form.report_id) {
      alert("Please type a Report ID to update.");
      return;
    }

    const updateFields = { report_id: form.report_id, user_id: user_id };
    for (const key in form) {
      if (key !== "report_id") {
        updateFields[key] = form[key];
      }
    }

    try {
      const response = await axios.put("http://127.0.0.1:5000/user_reports", updateFields);

      if (response.data.status === "successfully update") {
        alert("Report updated successfully!");
        reload();
      }
      else if (response.data.status === "failed to update due to lacking fields") {
        alert("Failed to update. Please fill out every field.");
      }
      else if (response.data.status === "report not found") {
        alert("Report not found. Please check your Report ID.");
      }
      else if (response.data.status === "failed to update due to no report_id") {
        alert("Update Failed. Report ID is required.");
      }
    } catch (err) {
        console.error("Update error:", err);
        alert("Update Failed.");
    }
  };

  const handleSelect = (id) => {
    if (selectedReport.includes(id)) {
        setSelectedReport(selectedReport.filter((id) => id !== id));
    } else {
        setSelectedReport([...selectedReport, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedReport.length === 0) {
      alert("Please select at least one report to delete.");
      return;
    }

    try {
      const response = await axios.delete("http://127.0.0.1:5000/user_reports", {
          data: { report_id: selectedReport },
      });

      if (response.data.status === "successfully delete") {
        alert("Reports deleted successfully!");
        reload();
      }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Delete Failed.");
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
        <h1 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "30px" }}>User Reports</h1>
        <button
          onClick={() => navigate("/app")}
          style={{...buttonStyle}}
        >
          Home Page
        </button>
        <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>Reporting Form</h2>
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
            {/* <h2 style={{marginBottom: "20px" }}>Form:</h2> */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
                <label>Report ID (Neccessary for Update)</label>
                <input
                    type="text"
                    style={inputStyle}
                    value={form.report_id}
                    onChange={(e) =>
                        setForm({ ...form, report_id: e.target.value })
                    }
                />

                <label>city</label>
                <input
                    type="text"
                    style={inputStyle}
                    value={form.city}
                    onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                    }
                    placeholder="eg., Fremont"
                />

                <label>state</label>
                <input
                    type="text"
                    style={inputStyle}
                    value={form.state}
                    onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                    }
                    placeholder="eg., California"
                />

                <label>Property Type</label>
                <select
                    style={inputStyle}
                    value={form.property_type}
                    onChange={(e) =>
                        setForm({ ...form, property_type: e.target.value })
                    }
                >
                  <option value="All Residential">All Residential</option>
                  <option value="Condo/Co-op">Condo/Co-op</option>
                  <option value="Multi-Family (2-4 Unit)">Multi-Family (2-4 Unit)</option>
                  <option value="Single Family Residential">Single Family Residential</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
                <label>Sold Price</label>
                <input
                    type="number"
                    style={inputStyle}
                    value={form.sold_price}
                    onChange={(e) =>
                        setForm({ ...form, sold_price: e.target.value })
                    }
                />

                <label>List Price</label>
                <input
                    type="number"
                    style={inputStyle}
                    value={form.list_price}
                    onChange={(e) =>
                        setForm({ ...form, list_price: e.target.value })
                    }
                />

                <label>List Time</label>
                <input
                    type="date"
                    style={inputStyle}
                    value={form.list_time}
                    onChange={(e) =>
                        setForm({ ...form, list_time: e.target.value })
                    }
                />

                <label>Sold Time</label>
                <input
                    type="date"
                    style={inputStyle}
                    value={form.sold_time}
                    onChange={(e) =>
                        setForm({ ...form, sold_time: e.target.value })
                    }
                />

                <label>Square Feet</label>
                <input
                    type="number"
                    style={inputStyle}
                    value={form.square_feet}
                    onChange={(e) =>
                        setForm({ ...form, square_feet: e.target.value })
                    }
                />
            </div>
          
            <div
                style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "25px",
                }}
            >
                {/* Insert Button */}
                <button
                    onClick={handleInsert}
                    style={buttonStyle}
                >
                Add
                </button>

                {/* Update button */}
                <button
                    onClick={handleUpdate}
                    style={buttonStyle}
                >
                Update
                </button>
            </div>
        </div>

        <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>My Reports</h2>
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
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
              <tr>
              <th>Report ID</th>
              <th>Region ID</th>
              <th>Property Type</th>
              <th>Sold Price</th>
              <th>List Price</th>
              <th>List Time</th>
              <th>Sold Time</th>
              <th>Square Feet</th>
              <th>Select to delete</th>
              </tr>
          </thead>
          <tbody>
              {reports.map((report) => (
              <tr key={report.report_id}>
                  <td>{report.report_id}</td>
                  <td>{report.region_id}</td>
                  <td>{report.property_type}</td>
                  <td>{report.sold_price}</td>
                  <td>{report.list_price}</td>
                  <td>{report.list_time}</td>
                  <td>{report.sold_time}</td>
                  <td>{report.square_feet}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReport.includes(report.report_id)}
                      onChange={() => handleSelect(report.report_id)}
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
            {/* Delete button */}
            <button
                onClick={handleDelete}
                style={buttonStyle}
            >
            Delete
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
    
export default UserReports;