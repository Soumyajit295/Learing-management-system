import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../Redux/Slices/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  
  const [previewImage, setPreviewImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function onValueChange(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function handleImage(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    if (!uploadImage) {
      toast.error("Failed to upload the avatar");
      return;
    }
    setSignupData({
      ...signupData,
      avatar: uploadImage,
    });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadImage);
    fileReader.addEventListener("load", function () {
      setPreviewImage(fileReader.result);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);
    const res = await dispatch(register(formData));
    if (res?.payload?.success) {
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 overflow-hidden">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md max-h-screen flex flex-col box-border">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex-grow space-y-4 overflow-auto">
          <div className="flex flex-col items-center mb-6">
            <label
              htmlFor="avatar"
              className="cursor-pointer mb-4 relative flex items-center justify-center"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImage}
                className="hidden"
              />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-gray-600"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-700 border-2 border-gray-600 text-gray-400">
                  <span className="text-xl">+</span>
                </div>
              )}
            </label>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm md:text-base font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={signupData.name}
              onChange={onValueChange}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm md:text-base font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={onValueChange}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm md:text-base font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={signupData.password}
                onChange={onValueChange}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
