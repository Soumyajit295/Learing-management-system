import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../Redux/Slices/courseSlice';

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    price: '',
    thumbnail: '',
  });
  const [previewImage, setPreviewImage] = useState('');

  function onValueChange(e) {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  }

  function handleImage(e) {
    e.preventDefault();
    const uploadedThumbnail = e.target.files[0];
    if (!uploadedThumbnail) {
      toast.error('Failed to upload the thumbnail');
      return;
    }
    setCourseData({
      ...courseData,
      thumbnail: uploadedThumbnail,
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedThumbnail);
    fileReader.addEventListener('load', function () {
      setPreviewImage(fileReader.result);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!courseData.name || !courseData.description || !courseData.price || !courseData.thumbnail) {
      toast.error('Please fill all fields and upload a thumbnail.');
      return;
    }

    const formData = new FormData();
    formData.append('name', courseData.name);
    formData.append('description', courseData.description);
    formData.append('price', courseData.price);
    formData.append('thumbnail', courseData.thumbnail);

    const res = await dispatch(createCourse(formData));
    if (res?.payload?.success) {
      setCourseData({
        name : '',
        description : '',
        price : '',
        thumbnail : ''
      })
      navigate('/courses');
    }
  }

  return (
    <div className='w-full flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white justify-center py-5'>
      <div className="w-full max-w-5xl mx-auto bg-gray-800 p-12 rounded-lg shadow-xl text-white ">
        <h2 className="text-4xl font-semibold mb-8 text-center">Create New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="name">Course Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={courseData.name}
              onChange={onValueChange}
              placeholder="Enter course name"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={onValueChange}
              placeholder="Enter course description"
              rows="4"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="price">Price (in INR)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={onValueChange}
              placeholder="Enter price"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="thumbnail">Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-gray-400"
            />
            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
                  alt="Course Thumbnail Preview"
                  className="w-64 h-48 object-cover rounded-md shadow-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
