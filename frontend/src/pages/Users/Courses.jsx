import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/courseSlice";
import CourseCard from "../../components/CourseCard";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Courses() {
  const { role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    async function getCourses() {
      await dispatch(getAllCourses());
    }
    getCourses();
  }, [dispatch]);

  useEffect(() => {
    const filteredCourse = courses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredCourse) {
      setFilteredCourse(filteredCourse);
    }
  }, [searchTerm]);


  if (isLoading || !courses || courses.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <div className="text-white text-center p-5">
          <div className="text-xl mb-2">Loading...</div>
          <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white overflow-hidden py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-light text-center mb-6">
          Boost Your Skills with Our{" "}
          <span className="text-orange-400">Courses</span>
        </h1>
        <div className="w-full flex justify-between items-center mb-12 flex-wrap">
          <h2 className="text-4xl font-semibold mb-4">Our Courses</h2>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full sm:w-1/3 p-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          {role === "ADMIN" && (
            <button
              onClick={() => navigate("/createcourse")}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
            >
              <FaPlus className="mr-2" /> Add Course
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : courses && courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p className="text-center text-gray-400">
              No courses available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
