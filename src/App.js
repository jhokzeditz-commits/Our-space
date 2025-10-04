import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import UserPage from "./UserPage";
import ReflectionPage from "./ReflectionPage";
import ImprovementPage from "./ImprovementPage";
import TestamentPage from "./TestamentPage"; // New page

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* User-specific pages */}
        <Route path="/user/:userName" element={<UserPage />} />
        <Route path="/reflection/:currentUser" element={<ReflectionPage />} />
        <Route path="/improvement/:currentUser" element={<ImprovementPage />} />
        <Route path="/testament/:userName" element={<TestamentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
