import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Hook to get course ID from URL
import api from "../api/api"; // Assuming this is the axios instance with the baseURL and token

const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editGrade, setEditGrade] = useState(null); // Track which student's grade is being edited
  const [grades, setGrades] = useState({}); // To store grades dynamically for each student
  const [successMessage, setSuccessMessage] = useState(null);

  // Function to handle the input grade changes
  const handleGradeChange = (studentId, grade) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: grade, // Update the grade for the specific student
    }));
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const courseData = response.data;

        // Initialize grades for students who already have assigned grades
        const initialGrades = {};
        courseData.grades.forEach((grade) => {
          initialGrades[grade.student] = grade.grade;
        });

        setCourse(courseData);
        setGrades(initialGrades); // Set the grades state with existing grades
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course details.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleSaveGrade = async (studentId) => {
    try {
      const grade = grades[studentId];
      if (!grade) {
        setError("Please enter a grade");
        return;
      }
      await api.post(`/courses/${id}/assign-grade`, {
        studentId,
        grade,
      });

      setSuccessMessage("Grade assigned successfully.");
      setError(null);
      setEditGrade(null); // Turn back to plain text after saving
    } catch (err) {
      setError("Failed to assign grade.");
    }
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8 bg-white text-gray-900">
      {course && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center text-green-700">
            {course.title}
          </h1>
          <p className="text-lg mb-4 text-center text-green-600">
            {course.description}
          </p>
          <div className="flex justify-center mb-4">
            <p className="text-sm text-green-500 mx-2">
              Start Date: {new Date(course.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-green-500 mx-2">
              End Date: {new Date(course.endDate).toLocaleDateString()}
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-center text-green-700">
            Enrolled Students
          </h2>
          {successMessage && (
            <p className="text-green-600 text-center">{successMessage}</p>
          )}
          {course.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mx-auto">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Grade</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {course.students.map((student, index) => (
                    <tr
                      key={student._id}
                      className={index % 2 === 0 ? "bg-green-100" : "bg-green-50"}
                    >
                      <td className="py-4 px-6 border-b">{student.name}</td>
                      <td className="py-4 px-6 border-b">{student.email}</td>
                      <td className="py-4 px-6 border-b">
                        {editGrade === student._id ? (
                          <input
                            type="number"
                            className="border p-2 rounded w-full"
                            placeholder="Assign grade"
                            value={grades[student._id] || ""} // Check for the existing grade
                            onChange={(e) =>
                              handleGradeChange(student._id, e.target.value)
                            }
                          />
                        ) : (
                          <span
                            className="cursor-pointer"
                            onClick={() => setEditGrade(student._id)}
                          >
                            {grades[student._id] !== undefined
                              ? grades[student._id]
                              : "No grade assigned"} {" "}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 border-b text-center">
                        {editGrade === student._id ? (
                          <button
                            onClick={() => handleSaveGrade(student._id)}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            onClick={() => setEditGrade(student._id)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-green-600">
              No students are enrolled in this course.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CourseDetails;