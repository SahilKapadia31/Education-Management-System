import React, { useEffect, useState } from "react";
import api from "../api/api";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/users/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        All Teachers
      </h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left text-green-900">
          <thead className="text-xs uppercase bg-green-100 text-green-800">
            <tr>
              <th className="px-6 py-3 border-b border-green-300">#</th>
              <th className="px-6 py-3 border-b border-green-300">Name</th>
              <th className="px-6 py-3 border-b border-green-300">Email</th>
              <th className="px-6 py-3 border-b border-green-300">Role</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher._id}
                className={`${index % 2 === 0 ? "bg-green-50" : "bg-white"
                  } hover:bg-green-100`}
              >
                <td className="px-6 py-4 border-b border-green-300 text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 border-b border-green-300 font-medium">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 border-b border-green-300">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 border-b border-green-300 text-green-700 font-semibold">
                  Teacher
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTeachers;
