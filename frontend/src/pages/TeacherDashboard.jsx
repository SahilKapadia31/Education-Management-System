import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const { name } = user;

  return (
    <div className="bg-white text-gray-900 p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Welcome to Teacher Dashboard, {name}!
      </h1>
      <p className="text-lg text-green-800">
        Use the sidebar to manage your courses and view students.
      </p>
    </div>
  );
};

export default TeacherDashboard;