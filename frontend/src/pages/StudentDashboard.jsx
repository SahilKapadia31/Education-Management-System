import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-4xl font-semibold text-green-700 mb-4">
        Welcome to Student Dashboard, {user.name}!
      </h1>
      <p className="text-lg text-green-500">
        Use the sidebar to view your enrolled courses, assignments, and grades.
      </p>
    </div>
  );
};

export default StudentDashboard;