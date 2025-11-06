import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Call protected route
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin-dashboard", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // optional if you use header auth
          }
        });
        setMessage(res.data.message);
      } catch (err) {
        setMessage("You are not authorized or token expired");
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert("Error logging out");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
