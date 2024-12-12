// controllers/courseController.js
const Course = require("../models/courseModel");

// Helper function to handle server errors
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Server Error", error });
};

// Admin creates a course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, startDate, endDate, teacher } = req.body;
    const course = new Course({ title, description, startDate, endDate, teacher });
    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin or Teacher can update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin can delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Students can view all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher students");
    res.status(200).json(courses);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("students", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    handleError(res, error);
  }
};

// Student enrolls in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    course.students.push(req.user._id);
    await course.save();
    res.status(200).json({ message: "Enrolled in course successfully", course });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin, Teacher, or Student can remove a student from the course
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role === "Admin" ||
      req.user.role === "Teacher" ||
      req.user._id.toString() === req.params.studentId
    ) {
      course.students = course.students.filter(
        (studentId) => studentId.toString() !== req.params.studentId
      );
      await course.save();
      return res.status(200).json({ message: "Student removed from course", course });
    }

    res.status(403).json({ message: "You do not have permission to remove this student" });
  } catch (error) {
    handleError(res, error);
  }
};

// Teacher assigns a grade to a student
exports.assignGrade = async (req, res) => {
  try {
    const { studentId, grade } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student is not enrolled in this course" });
    }

    const existingGrade = course.grades.find((g) => g.student.toString() === studentId);

    if (existingGrade) {
      existingGrade.grade = grade;
    } else {
      course.grades.push({ student: studentId, grade });
    }

    await course.save();
    res.status(200).json({ message: "Grade assigned successfully", course });
  } catch (error) {
    handleError(res, error);
  }
};

// Students can view their grades for a specific course
exports.getGrades = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate("grades.student");
    const studentGrades = course.grades.filter(
      (grade) => grade.student._id.toString() === req.user._id.toString()
    );

    if (!studentGrades.length) {
      return res.status(404).json({ message: "No grades found for this student" });
    }

    res.status(200).json(studentGrades);
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch courses assigned to a specific teacher
exports.getCoursesForTeacher = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }).populate("students");
    if (!courses.length) return res.status(404).json({ message: "No courses assigned to this teacher" });
    res.status(200).json(courses);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all courses where the logged-in student is enrolled
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id }).populate(
      "teacher",
      "name email"
    );
    if (!courses.length) return res.status(404).json({ message: "No courses enrolled" });
    res.status(200).json(courses);
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch specific course grade for the logged-in student
exports.getGradesByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "grades.student",
      "name email"
    );

    const studentGrade = course.grades.find(
      (grade) => grade.student._id.toString() === req.user._id.toString()
    );

    if (!studentGrade) return res.status(404).json({ message: "No grade found for this student" });

    res.status(200).json(studentGrade);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin enrolls a student in a course
exports.enrollStudentInCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student is already enrolled" });
    }

    course.students.push(studentId);
    await course.save();
    res.status(200).json({ message: "Student enrolled successfully", course });
  } catch (error) {
    handleError(res, error);
  }
};
