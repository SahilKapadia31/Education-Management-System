import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const ViewGrade = () => {
  const { courseId } = useParams(); // Get courseId from URL params
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/student/grades`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGrade(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching grade");
      } finally {
        setLoading(false);
      }
    };

    fetchGrade();
  }, [courseId]);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-700">
        Your Grade
      </h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">
          <span className="animate-spin inline-block w-6 h-6 border-4 border-t-4 border-green-600 rounded-full"></span>
          Loading...
        </div>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : grade ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-green-200 hover:shadow-xl transition-shadow">
          <p className="text-lg text-green-600 font-semibold">
            Grade: {grade.grade} marks
          </p>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">
          Grade not yet assigned.
        </p>
      )}
    </div>
  );
};

export default ViewGrade;