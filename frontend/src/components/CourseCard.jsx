import React from 'react';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <div className="flex-grow">
        <h3 className="text-2xl font-medium mb-2">{course.name}</h3>
        <p className="text-gray-400 mb-4">{course.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Price : ₹{course.price}</span>
        <button
          onClick={() => navigate(`/courses/${course._id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Explore Course
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
