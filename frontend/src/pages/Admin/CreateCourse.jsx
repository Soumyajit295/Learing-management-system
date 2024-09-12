import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalUsers } from "../../Redux/Slices/userSlice";
import { getTotalCourses } from "../../Redux/Slices/courseSlice";
import { getPayments } from "../../Redux/Slices/paymentSlice";

function AdminDashboard() {
  const { totalUsers } = useSelector((state) => state.user);
  const { totalCourses } = useSelector((state) => state.course);
  const { payments, loading } = useSelector((state) => state.payment);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getDetails() {
      await dispatch(getTotalUsers());
      await dispatch(getTotalCourses());
      await dispatch(getPayments());
    }
    getDetails();
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <h2 className="text-lg font-semibold text-gray-400">Total Users</h2>
          <p className="text-4xl font-bold text-white">{totalUsers}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow-lg">
          <h2 className="text-lg font-semibold text-gray-400">Total Courses</h2>
          <p className="text-4xl font-bold text-white">{totalCourses}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold text-gray-400 mb-4">
          Payment Details
        </h2>
        {loading ? (
          <div className="flex items-center justify-center w-full h-screen bg-slate-900">
            <div className="text-white text-center p-5">
              <div className="text-xl mb-2">Loading...</div>
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            </div>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left text-gray-300">Username</th>
                <th className="px-4 py-2 text-left text-gray-300">
                  Payment ID
                </th>
                <th className="px-4 py-2 text-left text-gray-300">Order ID</th>
                <th className="px-4 py-2 text-left text-gray-300">Signature</th>
                <th className="px-4 py-2 text-left text-gray-300">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment._id} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-gray-200">
                    {payment.user?.name}
                  </td>{" "}
                  <td className="px-4 py-2 text-gray-200">
                    {payment.razorpay_payment_id}
                  </td>
                  <td className="px-4 py-2 text-gray-200">
                    {payment.razorpay_order_id}
                  </td>
                  <td className="px-4 py-2 text-gray-200">
                    {payment.razorpay_signature}
                  </td>
                  <td className="px-4 py-2 text-gray-200">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
