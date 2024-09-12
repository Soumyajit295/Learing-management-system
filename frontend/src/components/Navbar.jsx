import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MenuBar from "./MenuBar";
import { logout } from "../Redux/Slices/userSlice";

function Navbar() {
  const [width, setWidth] = useState(window.innerWidth);
  const [menuBtn, setMenuBtn] = useState(window.innerWidth <= 700);
  const [menuBar, setMenuBar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, role, userData } = useSelector((state) => state.user);

  console.log(isLoggedIn)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setMenuBtn(window.innerWidth <= 700);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClose = () => {
    setMenuBar(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    setMenuBar(false);
    setShowDropdown(false)
  }, [location]);

  async function handleLogout() {
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      setShowDropdown(false);
      navigate("/login");
    }
  }

  return (
    <>
      {menuBar ? (
        <MenuBar onClose={onClose} />
      ) : (
        <div className="w-full p-5 bg-gray-900 flex justify-between items-center text-white shadow-lg">
          <h1 className="text-4xl font-bold">
            <span className="text-orange-600">C</span>oursi
            <span className="text-orange-600">f</span>y
          </h1>

          {menuBtn ? (
            <i
              onClick={() => setMenuBar(true)}
              className="fa-solid fa-bars text-white text-2xl cursor-pointer"
            ></i>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex-grow flex justify-center">
                <ul className="flex space-x-8 text-lg font-medium">
                  <li>
                    <Link
                      to="/"
                      className="hover:text-orange-600 transition duration-300 text-2xl"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/courses"
                      className="hover:text-orange-600 transition duration-300 text-2xl"
                    >
                      Courses
                    </Link>
                  </li>
                  {isLoggedIn && role === "ADMIN" && (
                    <li>
                      <Link
                        to="/admin"
                        className="hover:text-orange-600 transition duration-300 text-2xl"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <div className="relative flex space-x-4">
                {isLoggedIn ? (
                  <>
                    <i
                      className="fa-solid fa-user text-white text-2xl cursor-pointer"
                      onClick={toggleDropdown}
                    ></i>

                    {showDropdown && (
                      <div className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <ul className="text-gray-800">
                          <li className="px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                            Hey {userData?.name || "User"}
                          </li>

                          {role === "USER" && (
                            <>
                              <li
                                onClick={() => navigate("/my-profile")}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <Link to="/my-profile">My Profile</Link>
                              </li>
                              <li
                                onClick={() =>
                                  navigate(`/my-courses/${userData._id}`)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <Link to={`/my-courses/${userData._id}`}>
                                  My Courses
                                </Link>
                              </li>
                            </>
                          )}
                          <li
                            onClick={handleLogout}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <button>Logout</button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition duration-300"
                    >
                      Signup
                    </Link>
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition duration-300"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
