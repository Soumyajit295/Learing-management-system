import React from 'react'
import { useSelector } from 'react-redux'
import Login from '../pages/Common/Login'
import Denied from '../pages/Common/Denied'
import { Outlet } from 'react-router-dom'

function AdminAuth() {
  const {role,isLoggedIn} = useSelector((state)=>state.user)

  if(!isLoggedIn){
    return <Login/>
  }

  if(role!=='ADMIN'){
    return <Denied/>
  }

  return <Outlet/>
}

export default AdminAuth