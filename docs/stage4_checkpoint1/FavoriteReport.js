import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FavoriteReports() {
    const favorite_user_id = localStorage.getItem("user_id");
    const navigate = useNavigate();
    const [form, setForm] = useState({
        city: "",
        state: "",
        property_type: "All Residential",
        sold_price: "",
        list_price: "",
        list_time: "",
        sold_time: "",
        square_feet: "",
    });
    const [reports, setReports] = useState([]);
    const [searchReports, setSearchReports] = useState([]);
    const [selectedSearchReport, setSelectedSearchReport] = useState([]);
    const [selectedFavReport, setSelectedFavReport] = useState([]);

    const loadSearch = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/favorites_report_search", 
                form,
            );
            if (response.data.status === "failed to search due to lacking fields") {
                alert("Field can't be empty.");
            }
            else {
                setSearchReports(response.data);
            }
        } catch (err) {
            console.error("Error searching report:", err);
        }
    };

    const loadFavorites = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/favorites_report", {
                params: { user_id: favorite_user_id },
            });
            setReports(response.data);
        } catch (err) {
            console.error("Error loading favorite reports:", err);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const handleSelectSearch = (report_id) => {
        if (selectedSearchReport.includes(report_id)) {
            setSelectedSearchReport(selectedSearchReport.filter((id) => id !== report_id));
    } else {
        setSelectedSearchReport([...selectedSearchReport, report_id]);
    }
    };

    const handleSelectFav = (report_id) => {
        if (selectedFavReport.includes(report_id)) {
            setSelectedFavReport(selectedFavReport.filter((id) => id !== report_id));
        } else {
            setSelectedFavReport([...selectedFavReport, report_id]);
        }
    };

    const handleFavorite = async () => {
        if (selectedSearchReport.length === 0) {
            alert("No select item for favorite.");
            return;
        }
        try {
            const response = await axios.post("http://127.0.0.1:5000/favorites_report", {
                favorite_user_id: favorite_user_id,
                report_id: selectedSearchReport,
            });
            if (response.data.status === "successfully insert") {
                alert("Successfully added to favorite reports.");
                loadFavorites();
            }
            else if (response.data.status === "report not found") {
                alert("Report not found.");
            }
            else if (response.data.status === "report already favorited") {
                alert("Report already in favorite reports.");
            }
        } catch (err) {
            console.error("Error adding favorite reports:", err);
        }
    };

    const handleDelete = async () => {
        if (selectedFavReport.length === 0) {
            alert("No select item for delete.");
            return;
        }
        try {
            const response = await axios.delete("http://127.0.0.1:5000/favorites_report", {
                data:{
                    favorite_user_id: favorite_user_id,
                    report_id: selectedFavReport,
                }
            });
            if (response.data.status === "successfully delete") {
                alert("Successfully deleted from favorite reports.");
                loadFavorites();
            }
        } catch (err) {
            console.error("Error deleting favorite reports:", err);
        }
    };

    return(
        <div
            style={{
                backgroundColor: "#F2EFDF",
                minHeight: "100vh",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
            >
                <h1 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "30px" }}>Favorite Reports</h1>
                <button
                onClick={() => navigate("/app")}
                style={{...buttonStyle}}
                >
                Home Page
                </button>
                <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>Searching Form</h2>
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
                            placeholder="yyyy-mm-dd"
                        />

                        <label>Sold Time</label>
                        <input
                            type="date"
                            style={inputStyle}
                            value={form.sold_time}
                            onChange={(e) =>
                                setForm({ ...form, sold_time: e.target.value })
                            }
                            placeholder="yyyy-mm-dd"
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
                        {/* Search Button */}
                        <button
                            onClick={loadSearch}
                            style={buttonStyle}
                        >
                        Search
                        </button>
                    </div>
                </div>
                
                <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>Searching Result</h2>
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
                    {/* show search report */}
                    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                        <th>Report ID</th>
                        <th>User ID</th>
                        <th>Region ID</th>
                        <th>Property Type</th>
                        <th>Sold Price</th>
                        <th>List Price</th>
                        <th>List Time</th>
                        <th>Sold Time</th>
                        <th>Square Feet</th>
                        <th>Select to Add to Favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchReports.map((report) => (
                        <tr key={report.report_id}>
                            <td>{report.report_id}</td>
                            <td>{report.user_id}</td>
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
                                checked={selectedSearchReport.includes(report.report_id)}
                                onChange={() => handleSelectSearch(report.report_id)}
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
                    {/* Add button */}
                    <button
                        onClick={handleFavorite}
                        style={buttonStyle}
                    >
                    Add
                    </button>
                </div>

                <h2 style={{ color: "#493f3cff", textAlign: "center", marginBottom: "20px" }}>My Favorite reports</h2>
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
                        <th>Report ID</th>
                        <th>User ID</th>
                        <th>Region ID</th>
                        <th>Property Type</th>
                        <th>Sold Price</th>
                        <th>List Price</th>
                        <th>List Time</th>
                        <th>Sold Time</th>
                        <th>Square Feet</th>
                        <th>Select to Delete from Favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                        <tr key={report.report_id}>
                            <td>{report.report_id}</td>
                            <td>{report.user_id}</td>
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
                                checked={selectedFavReport.includes(report.report_id)}
                                onChange={() => handleSelectFav(report.report_id)}
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
    
export default FavoriteReports;