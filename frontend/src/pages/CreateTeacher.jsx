import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateTeacher = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleValidation = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!validateEmail(formData.email)) errors.email = "Invalid email format.";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters long.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      await api.post("/users/create-teacher", formData);
      setSuccess("Teacher created successfully");
      setError(null);
      navigate("/teachers");
    } catch (err) {
      setError("Failed to create teacher");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-green-50 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Create Teacher</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        <form onSubmit={handleCreateTeacher}>
          <div className="mb-4">
            <label className="block text-green-900">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter teacher's name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border ${validationErrors.name ? "border-red-500" : "border-green-300"
                } rounded mt-2`}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-green-900">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter teacher's email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${validationErrors.email ? "border-red-500" : "border-green-300"
                } rounded mt-2`}
            />
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-green-900">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border ${validationErrors.password ? "border-red-500" : "border-green-300"
                } rounded mt-2`}
            />
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Create Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacher;