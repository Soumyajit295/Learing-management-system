import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/userSlice";

function MenuBar({ onClose }) {
  const { isLoggedIn, role , userData} = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleLogout(){
    const res = await dispatch(logout())
    if(res?.payload?.success){
      navigate('/login')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-h-screen bg-gray-900 p-5 transform translate-x-0 transition-transform duration-500 ease-in-out">
        <div className="w-full flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-white">
            <span className="text-orange-600">C</span>oursi
            <span className="text-orange-600">f</span>y
          </h1>
          <i
            onClick={onClose}
            className="fa-solid fa-circle-xmark text-3xl text-red-500 hover:text-red-600 transition-all ease-in-out duration-300 cursor-pointer"
          ></i>
        </div>
        <div className="flex flex-col space-y-6">
          <Link
            to="/"
            className="text-white text-lg hover:text-orange-600 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-white text-lg hover:text-orange-600 transition-all duration-300"
          >
            Courses
          </Link>
          {isLoggedIn && role === "ADMIN" && (
            <Link
              to="/admin"
              className="text-white text-lg hover:text-orange-600 transition-all duration-300"
            >
              Admin
            </Link>
          )}
          {isLoggedIn && role !== "ADMIN" && (
            <>
              <Link
                to="/my-profile"
                className="text-white text-lg hover:text-orange-600 transition-all duration-300"
              >
                My Profile
              </Link>
              <Link
                to={`/my-courses/${userData._id}`}
                className="text-white text-lg hover:text-orange-600 transition-all duration-300"
              >
                My courses
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300">
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Login
              </Link>
            </>
          )}
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <p className="text-gray-400 text-sm">
            © 2024 Coursify. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
