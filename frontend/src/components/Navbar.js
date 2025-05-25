// File: frontend/src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
    <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
    <Link to="/purchases" style={{ marginRight: "15px" }}>Purchases</Link>
    <Link to="/transfers" style={{ marginRight: "15px" }}>Transfers</Link>
    <Link to="/assignments" style={{ marginRight: "15px" }}>Assignments</Link>
    <Link to="/" style={{ float: "right", color: "red" }}>Logout</Link>
  </nav>
);

export default Navbar;
