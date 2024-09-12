import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addLecture } from '../../Redux/Slices/lectureSlice';

function AddLecture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {courseId} = useParams();

  const [lectureData, setLectureData] = useState({
    title: '',
    description: '',
    lecture: '',
  });
  const [previewVideo, setPreviewVideo] = useState('');

  function onValueChange(e) {
    const { name, value } = e.target;
    setLectureData({
      ...lectureData,
      [name]: value,
    });
  }

  function handleVideo(e) {
    e.preventDefault();
    const uploadedVideo = e.target.files[0];
    if (!uploadedVideo) {
      toast.error('Failed to upload the video');
      return;
    }
    setLectureData({
      ...lectureData,
      lecture: uploadedVideo,
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedVideo);
    fileReader.addEventListener('load', function () {
      setPreviewVideo(fileReader.result);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!lectureData.title || !lectureData.description || !lectureData.lecture) {
      toast.error('Please fill all fields and upload a video.');
      return;
    }

    const formData = new FormData();
    formData.append('title', lectureData.title);
    formData.append('description', lectureData.description);
    formData.append('lecture', lectureData.lecture);

    const res = await dispatch(addLecture({data : formData,courseId}))
    if(res?.payload?.success){
        setLectureData({
            title : '',
            description : '',
            lecture : ''
        })
        navigate(`/courses/${courseId}/lectures`)
    }
  }

  return (
    <div className='w-full flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white justify-center py-5'>
      <div className="w-full max-w-5xl mx-auto bg-gray-800 p-12 rounded-lg shadow-xl text-white">
        <h2 className="text-4xl font-semibold mb-8 text-center">Add New Lecture</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="title">Lecture Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={lectureData.title}
              onChange={onValueChange}
              placeholder="Enter lecture title"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={lectureData.description}
              onChange={onValueChange}
              placeholder="Enter lecture description"
              rows="4"
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" htmlFor="video">Upload Video</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleVideo}
              className="w-full text-gray-400"
            />
            {previewVideo && (
              <div className="mt-4">
                <video
                  src={previewVideo}
                  controls
                  className="w-full h-48 object-cover rounded-md shadow-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Add Lecture
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLecture;
