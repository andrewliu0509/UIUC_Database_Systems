import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";   
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import UserReports from "./UserReports";
import PriceRanking from "./PriceRanking";
import ShowMetric from "./ShowMetric";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />      
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/app" element={<Home />} />  
      <Route path ="/user_reports" element={<UserReports />} /> 
      <Route path="/price_ranking" element={<PriceRanking />} />
      <Route path="/show_metric" element={<ShowMetric />} />
    </Routes>
  );
}

export default App;