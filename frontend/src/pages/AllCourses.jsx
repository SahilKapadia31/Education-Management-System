import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (courseId) => navigate(`/edit-course/${courseId}`);

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${courseId}`);
        setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
        alert("Course deleted successfully");
      } catch (error) {
        console.error("Failed to delete course", error);
        alert("Failed to delete course");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        All Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Teacher:</strong> {course.teacher?.name || "Not assigned"}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(course._id)}
                  className="bg-white text-green-700 border border-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-white text-red-700 border border-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;