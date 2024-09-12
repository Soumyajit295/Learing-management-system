import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { dropCourse, getSingleCourse } from "../../Redux/Slices/courseSlice";
import { getUserDetails } from "../../Redux/Slices/userSlice";
import {
  createOrder,
  getKey,
  verifyPayment,
} from "../../Redux/Slices/paymentSlice";
import toast from "react-hot-toast";
import DeletePopup from "../../components/DeletePopUp";

function SingleCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const [showLectures, setShowLectures] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { isLoading, singleCourse } = useSelector((state) => state.course);
  const { userData, role } = useSelector((state) => state.user);
  const { order, loading, error, paymentSuccess, key } = useSelector(
    (state) => state.payment
  );

  useEffect(() => {
    async function fetchUserData() {
      await dispatch(getUserDetails(userData?._id));
    }
    fetchUserData();
  }, [dispatch, userData?._id]);

  useEffect(() => {
    async function getCourse() {
      await dispatch(getSingleCourse(courseId));
    }
    getCourse();
  }, [dispatch, courseId]);

  useEffect(() => {
    function handleShowLectures() {
      const course = userData?.courses?.find(
        (item) => item.toString() === courseId
      );

      if (course || userData?.role === "ADMIN") {
        setShowLectures(true);
      }
    }
    handleShowLectures();
  }, [userData, courseId, singleCourse]);

  async function deleteCourse() {
    setShowPopup(false);
    const res = await dispatch(dropCourse(courseId));
    if (res?.payload?.success) {
      navigate('/courses');
    }
  }

  function onPopupClose() {
    setShowPopup(false);
  }

  const handlePayment = async () => {
    try {
      setRedirecting(true);

      const orderResponse = await dispatch(
        createOrder({ amount: singleCourse.price, courseId })
      );

      if (orderResponse?.payload?.id) {
        await dispatch(getKey());
        const options = {
          key: key,
          amount: orderResponse.payload.amount,
          currency: "INR",
          name: singleCourse.name,
          description: "Course Purchase",
          order_id: orderResponse.payload.id,
          handler: async (response) => {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await dispatch(
              verifyPayment({
                paymentData,
                userId: userData._id,
                courseId: singleCourse._id,
              })
            );

            if (verifyResponse?.payload?.success) {
              toast.success("Purchase successful!");
              navigate(`/my-courses/${userData._id}`);
            } else {
              toast.error("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: userData.name,
            email: userData.email,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error("Something went wrong with the payment. Please try again.");
      console.error(err);
    } finally {
      setRedirecting(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
          <img
            src={singleCourse.thumbnail}
            alt={singleCourse.name}
            className="w-full md:w-[400px] h-[250px] object-cover rounded-lg shadow-lg mb-6 transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <div className="flex space-x-3">
            {showLectures ? (
              <button
                onClick={() =>
                  navigate(`/courses/${singleCourse._id}/lectures`)
                }
                className="px-6 py-3 rounded-lg transition duration-300 bg-orange-600 text-white hover:bg-orange-700 hover:bg-opacity-80"
              >
                Watch lectures
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 hover:bg-opacity-80 transition duration-300"
              >
                Buy Course
              </button>
            )}
            {role === "ADMIN" && (
              <>
                <button 
                  onClick={() => setShowPopup(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:bg-opacity-80 transition duration-300">
                  Delete Course
                </button>
                <button 
                  onClick={() => navigate(`/editcourse/${courseId}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:bg-opacity-80 transition duration-300">
                  Edit Course
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-left">
          <h1 className="text-4xl font-semibold mb-4">{singleCourse.name}</h1>
          <span className="text-3xl font-bold text-orange-400 mb-6 block">
            Price: ₹{singleCourse.price}
          </span>
          <p className="text-gray-400 text-lg leading-relaxed mb-4">
            {singleCourse.description}
          </p>

          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Total Lectures</h2>
            <p className="text-lg text-gray-300">
              {singleCourse.lectures?.length || 0} lectures available
            </p>
          </div>
        </div>
      </div>
      {showPopup && (
        <DeletePopup showPopup={showPopup} onClose={onPopupClose} onConfirm={deleteCourse} message={"Are you sure you want to delete the course?"} />
      )}
      {redirecting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="text-white text-center p-5">
            <div className="text-xl mb-2">Redirecting to payment...</div>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCourse;
