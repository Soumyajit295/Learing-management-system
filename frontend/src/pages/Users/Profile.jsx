import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, changeUserName } from '../../Redux/Slices/userSlice';

function Profile() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [userCredentials, setUserCredentials] = useState({
    name: userData.name,
    email: userData.email,
  });
  const [name, setName] = useState(userData.name);
  const [isEditable, setIsEditable] = useState(false);

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
  });

  function checkIsEditable(e) {
    const { value } = e.target;
    setName(value);
    setIsEditable(value !== userCredentials.name);
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const res = await dispatch(changePassword({
      oldPassword: password.oldPassword,
      newPassword: password.newPassword,
    }));
    if (res?.payload?.success) {
      setPassword({
        oldPassword: '',
        newPassword: '',
      });
    }
  }

  async function handleChangeName(e) {
    e.preventDefault();
    const res = await dispatch(changeUserName(name));
    if (res?.payload?.success) {
      setUserCredentials({
        ...userCredentials,
        name: res?.payload?.data?.name,
      });
      setIsEditable(false);
    }
  }

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-5'>
      <div className='w-full max-w-lg md:max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg'>
        <div className='flex items-center mb-8'>
          <img
            src={userData.avatar}
            alt='profile photo'
            className='w-32 h-32 rounded-full object-cover mr-6 shadow-lg'
          />
          <div>
            <h1 className='text-3xl md:text-4xl font-bold mb-2'>
              Hello, <span className='text-orange-400'>{userData.name}</span>
            </h1>
            <p className='text-lg text-gray-400'>Welcome to your profile!</p>
          </div>
        </div>

        <form onSubmit={handleChangeName} className='space-y-8'>
          <div className='flex flex-col'>
            <label htmlFor='name' className='text-sm font-semibold text-gray-300'>
              Name
            </label>
            <input
              id='name'
              name='name'
              value={name}
              onChange={checkIsEditable}
              type='text'
              className='mt-2 p-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300'
              placeholder='Enter your name'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='email' className='text-sm font-semibold text-gray-300'>
              Email
            </label>
            <input
              id='email'
              name='email'
              value={userCredentials.email}
              type='text'
              disabled
              className='mt-2 p-4 rounded-lg bg-gray-700 text-gray-400 border-none'
            />
          </div>

          {isEditable && (
            <button
              type='submit'
              className='w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:outline-none'
            >
              Save Changes
            </button>
          )}
        </form>

        <div className='mt-12'>
          <h2 className='text-2xl font-semibold text-white mb-6'>Change Password</h2>
          <form onSubmit={handleChangePassword} className='space-y-6'>
            <div className='flex flex-col'>
              <label htmlFor='oldPassword' className='text-sm font-semibold text-gray-300'>
                Old Password
              </label>
              <input
                id='oldPassword'
                name='oldPassword'
                value={password.oldPassword}
                onChange={handlePasswordChange}
                type='password'
                required
                className='mt-2 p-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300'
                placeholder='Enter old password'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='newPassword' className='text-sm font-semibold text-gray-300'>
                New Password
              </label>
              <input
                id='newPassword'
                name='newPassword'
                value={password.newPassword}
                onChange={handlePasswordChange}
                type='password'
                required
                className='mt-2 p-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300'
                placeholder='Enter new password'
              />
            </div>

            <button
              type='submit'
              className='w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:outline-none'
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
