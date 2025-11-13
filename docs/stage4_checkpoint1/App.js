import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({
    user_name: "",
    user_id: "",
    user_password: ""
  });

  // GET
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // ADD
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/add", user);
      alert("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🏠 RobinSpot Database Demo</h2>

      <h3>📋 Existing House Data (from /data):</h3>
      <ul>
        {data.map((row, idx) => (
          <li key={idx}>property_type: {row.property_type}</li>
        ))}
      </ul>

      <hr />

      <h3>➕ Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={user.user_name}
          onChange={(e) => setUser({ ...user, user_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="User ID"
          value={user.user_id}
          onChange={(e) => setUser({ ...user, user_id: e.target.value })}
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
    </div>
  );
}

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
