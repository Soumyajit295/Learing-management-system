import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const { userData,isLoggedIn, role } = useSelector((state) => state.user);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-4 leading-tight text-shadow-lg text-center">
        Welcome to <span className="text-orange-400">Coursify</span>
      </h1>
      <p className="text-xl mb-8 text-center max-w-3xl mx-4">
        Discover an extensive range of courses and start your learning journey
        with us today!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {isLoggedIn ? (
          role === 'ADMIN' ? (
            <Link
              to="/admin"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to={`/my-courses/${userData?._id}`}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore My Courses
            </Link>
          )
        ) : (
          <Link
            to="/signup"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Join coursify
          </Link>
        )}
        <Link
          to="/courses"
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Explore More
        </Link>
      </div>
    </div>
  );
}

export default Home;
