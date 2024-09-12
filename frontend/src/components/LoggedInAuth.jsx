import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Denied from '../pages/Common/Denied';
import Login from '../pages/Common/Login';

function LoggedInAuth() {
  const { isLoggedIn, role } = useSelector((state) => state.user)
  if (!isLoggedIn) {
    return <Login />
  }
  if (role === 'ADMIN') {
    return <Denied />
  }
  return <Outlet />
}

export default LoggedInAuth
