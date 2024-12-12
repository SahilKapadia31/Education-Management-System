import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaChalkboardTeacher,
  FaBook,
  FaSignOutAlt,
  FaUser,
  FaAngleDown,
  FaAngleUp,
  FaUserGraduate,
  FaTachometerAlt,
} from "react-icons/fa"; // Import icons

const Sidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to toggle the dropdowns
  const [dropdownState, setDropdownState] = useState({
    teacher: false,
    course: false,
    student: false,
  });

  const toggleDropdown = (key) => {
    setDropdownState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const sidebarBg = "bg-white text-gray-800";
  const linkHover = "hover:text-green-600";

  return (
    <div className={`${sidebarBg} h-screen w-64 p-6 shadow-lg`}>
      <h1 className="text-2xl font-bold mb-6">EMS Dashboard</h1>

      {user ? (
        <>
          {/* Show User Info */}
          <p className="mb-4 flex items-center">
            <FaUser className="mr-2 text-green-600" /> Hello, {user.name}
          </p>

          {/* Dashboard Link */}
          <div className="mb-6">
            <h3 className="font-semibold cursor-pointer flex items-center text-green-600">
              <Link
                to={
                  user.role === "Admin"
                    ? "/admin"
                    : user.role === "Teacher"
                      ? "/teacher"
                      : "/student"
                }
                className={`flex items-center ${linkHover}`}
              >
                <FaTachometerAlt className="mr-2" /> Dashboard
              </Link>
            </h3>
          </div>

          {/* Admin Dropdown */}
          {user.role === "Admin" && (
            <div className="mb-6">
              {/* Manage Teacher Dropdown */}
              <div className="mb-4">
                <h3
                  className="font-semibold cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("teacher")}
                >
                  <span className="flex items-center">
                    <FaChalkboardTeacher className="mr-2 text-green-600" />
                    Manage Teacher
                  </span>
                  <span>
                    {dropdownState.teacher ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </h3>
                {dropdownState.teacher && (
                  <ul className="mt-2 pl-4">
                    <li className="mb-2">
                      <Link
                        to="/create-teacher"
                        className={`${linkHover} text-gray-700`}
                      >
                        Create Teacher
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/teachers"
                        className={`${linkHover} text-gray-700`}
                      >
                        See All Teachers
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Manage Course Dropdown */}
              <div className="mb-4">
                <h3
                  className="font-semibold cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("course")}
                >
                  <span className="flex items-center">
                    <FaBook className="mr-2 text-green-600" /> Manage Course
                  </span>
                  <span>
                    {dropdownState.course ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </h3>
                {dropdownState.course && (
                  <ul className="mt-2 pl-4">
                    <li className="mb-2">
                      <Link
                        to="/create-course"
                        className={`${linkHover} text-gray-700`}
                      >
                        Create Course
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/courses"
                        className={`${linkHover} text-gray-700`}
                      >
                        See All Courses
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Manage Student Dropdown */}
              <div>
                <h3
                  className="font-semibold cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDropdown("student")}
                >
                  <span className="flex items-center">
                    <FaUserGraduate className="mr-2 text-green-600" />
                    Manage Student
                  </span>
                  <span>
                    {dropdownState.student ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </h3>
                {dropdownState.student && (
                  <ul className="mt-2 pl-4">
                    <li className="mb-2">
                      <Link
                        to="/students"
                        className={`${linkHover} text-gray-700`}
                      >
                        See All Students
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/enroll-student"
                        className={`${linkHover} text-gray-700`}
                      >
                        Enroll Student in Course
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-700 flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </>
      ) : (
        <div className="space-y-4">
          {/* Login and Register Links */}
          <Link
            to="/login"
            className="block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;