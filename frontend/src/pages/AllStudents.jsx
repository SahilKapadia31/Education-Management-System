import React, { useEffect, useState } from "react";
import api from "../api/api"; // Assuming this is the axios instance with the baseURL and token

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/users/students");
        setStudents(response.data);
      } catch (err) {
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Students
      </h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-green-500">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={`${index % 2 === 0 ? "bg-green-50" : "bg-white"
                  } hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {student.name}
                </td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4 text-green-600">{student.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudents;