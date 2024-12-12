import React, { useState, useEffect } from "react";
import api from "../api/api";

const EnrollStudent = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, coursesResponse] = await Promise.all([
          api.get("/users/students"),
          api.get("/courses"),
        ]);

        setStudents(studentsResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setMessage("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      setMessage("Please select both a student and a course.");
      return;
    }

    try {
      await api.post(`/courses/${selectedCourse}/enroll-student`, {
        studentId: selectedStudent,
      });

      setMessage("Student enrolled successfully!");
      setSelectedStudent("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Enrollment failed", error);
      setMessage("Failed to enroll student. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
        Enroll Student in Course
      </h1>

      {message && (
        <p
          className={`text-center mb-4 font-medium ${message.includes("successfully") ? "text-green-700" : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-green-700">
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg text-green-800 border-green-300 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-green-700">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg text-green-800 border-green-300 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleEnroll}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
      >
        Enroll Student
      </button>
    </div>
  );
};

export default EnrollStudent;