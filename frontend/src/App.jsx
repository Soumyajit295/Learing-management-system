import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Signup from './pages/Common/Signup'
import Login from './pages/Common/Login'
import Home from './pages/Users/Home'
import Courses from './pages/Users/Courses'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Denied from './pages/Common/Denied'
import NotExist from './pages/Common/NotExist'
import LoggedInAuth from './components/LoggedInAuth'
import Profile from './pages/Users/Profile'
import MyCourses from './pages/Users/MyCourses'
import AdminAuth from './components/AdminAuth'
import AdminDashboard from './pages/Admin/AdminDashboard'
import IsLogin from './components/IsLogin'
import SingleCoursePage from './pages/Users/SingleCoursePage'
import CreateCourse from './pages/Admin/CreateCourse'
import EditCourse from './pages/Admin/EditCourse'
import LecturesPage from './pages/Users/LecturesPage'
import AddLecture from './pages/Admin/AddLecture'
import EditLecture from './pages/Admin/EditLecture'

function App() {
  const url = import.meta.env.VITE_API_URL
  console.log(url)
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/denied' element={<Denied/>}/>
          <Route path='*' element={<NotExist/>}/>
          <Route path='/courses' element={<Courses/>}/>

          <Route element={<LoggedInAuth/>}>
            <Route path='/my-profile' element={<Profile/>}/>
            <Route path='/my-courses/:userId' element={<MyCourses/>}/>
          </Route>

          <Route element={<AdminAuth/>}>
            <Route path='/admin' element={<AdminDashboard/>}/>
            <Route path='/createcourse' element={<CreateCourse/>}/>
            <Route path='/editcourse/:courseId' element={<EditCourse/>}/>
            <Route path='/createlecture/:courseId' element={<AddLecture/>}/>
            <Route path='/editlecture/:courseId/:lectureId' element={<EditLecture/>}/>
          </Route>

          <Route element={<IsLogin/>}>
            <Route path='/courses/:courseId' element={<SingleCoursePage/>}/>
            <Route path='/courses/:courseId/lectures' element={<LecturesPage/>}/>
          </Route>

        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
