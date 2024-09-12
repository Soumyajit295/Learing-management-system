import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FiVideoOff } from "react-icons/fi";
import { getSingleCourse } from "../../Redux/Slices/courseSlice";
import DeletePopup from "../../components/DeletePopUp";
import { deleteLecture } from "../../Redux/Slices/lectureSlice";

function LecturesPage() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [lectureTobeDeleted, setLectureTobeDeleted] = useState(null);
  const { role } = useSelector((state) => state.user);
  const [lectureIndex, setLectureIndex] = useState(0);
  const { singleCourse, isLoading } = useSelector((state) => state.course);
  const [lectures, setLecture] = useState([]);

  useEffect(() => {
    async function fetchLectures() {
      const res = await dispatch(getSingleCourse(courseId));
      if (res?.payload?.success) {
        setLecture(res.payload.data.lectures);
      }
    }
    fetchLectures();
  }, [dispatch, courseId]);

  const handleLecture = (index) => {
    setLectureIndex(index);
    window.scroll(0, 0);
  };

  const handleDeleteLecture = (lectureId) => {
    setShowPopup(true);
    setLectureTobeDeleted(lectureId);
  };

  async function confirmDelete() {
    setShowPopup(false);
    if (lectureTobeDeleted) {
      const res = await dispatch(
        deleteLecture({ courseId, lectureId: lectureTobeDeleted })
      );
      if (res?.payload?.success) {
        setLecture(
          lectures.filter(
            (lecture) => lecture._id.toString() !== lectureTobeDeleted
          )
        );
      }
    }
  }

  function onPopupClose() {
    setShowPopup(false);
  }

  if (isLoading || !singleCourse || Object.keys(singleCourse).length === 0) {
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
    <div className="w-full flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4">
      <div className="w-full lg:w-2/3 bg-gray-900 p-4 lg:p-6 rounded-lg shadow-lg mb-6 lg:mb-0">
        {lectures?.length > 0 ? (
          <>
            <video
              className="object-cover w-full rounded-lg mb-5 shadow-xl"
              controls
              disablePictureInPicture
              muted
              controlsList="nodownload"
              src={lectures[lectureIndex]?.lecture}
            ></video>
            <div className="text-white space-y-2">
              <h1 className="text-2xl font-bold">
                {singleCourse?.lectures[lectureIndex]?.title}
              </h1>
              <p className="text-gray-400">
                {singleCourse?.lectures[lectureIndex]?.description}
              </p>
              <p>
                Added on:{" "}
                {new Date(
                  singleCourse?.lectures[lectureIndex]?.addedOn
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(
                  singleCourse?.lectures[lectureIndex]?.addedOn
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center text-white">
            <FiVideoOff className="text-6xl text-gray-500 mb-4" />
            <h2 className="text-3xl font-bold">No Lectures Available</h2>
            <p className="text-gray-400 text-lg mt-2">
              This course does not have any lectures yet.
            </p>
            {role === "ADMIN" && (
              <button
                onClick={() => navigate(`/createlecture/${courseId}`)}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
              >
                Add First Lecture
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/3 lg:pl-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-white">
            Lectures
          </h2>
          {role === "ADMIN" && (
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
            >
              <FaPlus className="mr-2" /> Add Lecture
            </button>
          )}
        </div>

        <div className="space-y-4">
          {lectures?.length > 0 ? (
            lectures?.map((lecture, index) => (
              <div
                key={lecture._id}
                onClick={() => handleLecture(index)}
                className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-all flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white">
                    <span className="text-orange-600">{index + 1}. </span>
                    {lecture.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-400">
                    {lecture.description}
                  </p>
                </div>
                {role === "ADMIN" && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/editlecture/${courseId}/${lecture._id}`)
                      }
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteLecture(lecture._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white">
              <p>No lectures available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <DeletePopup
          showPopup={showPopup}
          onClose={onPopupClose}
          onConfirm={confirmDelete}
          message={"Are you sure you want to remove the lecture?"}
        />
      )}
    </div>
  );
}

export default LecturesPage;
