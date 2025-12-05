import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";   // <-- your current App.js logic will move here
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import UserReports from "./UserReports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />      {/* login page */}
      <Route path="/signup" element={<SignUp />} /> {/* sign-up page */}
      <Route path="/app" element={<Home />} />  {/* main app page */}
      <Route path ="/user_reports" element={<UserReports />} /> {/* user reports page */}
    </Routes>
  );
}

export default App;