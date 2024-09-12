import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleCourse } from "../../Redux/Slices/courseSlice";
import { getUserDetails } from "../../Redux/Slices/userSlice";

function MyCourses() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { singleCourse } = useSelector((state) => state.course);

  console.log("UserId : ",userId)
  console.log("User : ",user)
  console.log("Courses : ",courses)

  useEffect(() => {
    async function fetchData() {
      const res = await dispatch(getUserDetails(userId));
      console.log("Response for user : ",res)

      if (res?.payload?.success) {
        const userData = res.payload.data;
        setUser(userData);

        if (userData?.courses.length > 0) {
          const coursePromises = userData.courses.map(async (course) => {
            const courseResponse = await dispatch(
              getSingleCourse(course.toString())
            );
            return courseResponse?.payload?.data;
          });

          const fetchedCourses = await Promise.all(coursePromises);
          setCourses(fetchedCourses);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [dispatch, userId]);

  if (loading) {
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
    <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white overflow-hidden py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">My Courses</h1>

      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <h2 className="text-2xl font-semibold">
            You have not purchased any courses yet.
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {course.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 truncate">
                  {course.description.length > 60
                    ? `${course.description.slice(0, 60)}...`
                    : course.description}
                </p>
                <button
                  onClick={() => navigate(`/courses/${course._id}/lectures`)}
                  className="bg-orange-600 text-sm text-white px-3 py-2 rounded-lg hover:bg-orange-500 transition-all ease-in-out duration-300"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
