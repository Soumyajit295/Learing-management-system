import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

function IsLogin() {
  const {isLoggedIn} = useSelector((state)=>state.user)
  console.log(isLoggedIn)

  if(!isLoggedIn){
    toast.error("To explore courses please login")
    return
  }
  return <Outlet/>
}

export default IsLogin