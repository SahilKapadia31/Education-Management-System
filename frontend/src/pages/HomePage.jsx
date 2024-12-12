import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        default:
          navigate("/student");
          break;
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="text-center p-6 border rounded-lg shadow-lg bg-green-50">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Welcome to the Education Management System
        </h1>
        <p className="text-green-600 text-lg">
          Manage your tasks efficiently and effectively with our system.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
