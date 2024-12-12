import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    teacher: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/users/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
      setError("Failed to fetch teachers.");
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse({
          title: response.data.title || "",
          description: response.data.description || "",
          startDate: new Date(response.data.startDate).toISOString().split("T")[0],
          endDate: new Date(response.data.endDate).toISOString().split("T")[0],
          teacher: response.data.teacher?._id || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load course", error);
        setError("Failed to load course.");
      }
    };

    fetchCourse();
    fetchTeachers();
  }, [id]);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${id}`, course);
      alert("Course updated successfully");
      navigate("/courses");
    } catch (error) {
      console.error("Failed to update course", error);
      setError("Failed to update course.");
    }
  };

  if (loading) {
    return <div className="text-center text-green-700">Loading course data...</div>;
  }

  return (
    <div className="p-8 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Edit Course</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-green-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded mt-2 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-green-700 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={course.description}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded mt-2 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-green-700 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={course.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded mt-2 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-green-700 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={course.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded mt-2 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-green-700 font-medium">Teacher</label>
          <select
            name="teacher"
            value={course.teacher}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded mt-2 focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;