import React from 'react'
import { assets } from '../../assets/assets'
import { useDispatch } from 'react-redux'
import { logout } from "../../store/authentication.js"
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SideBar = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {

    try {

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/user/logout-user`, {

        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
        }

      })

      if (response.ok) {

        const res = await response.json();
        dispatch(logout())

        localStorage.removeItem("instructorToken")
        toast.success(" logout successfully")
        navigate("/")

      }
    } catch (error) {

      console.log("Error while logout the user", error)
    }
  }
  return (
    <div className='flex flex-col gap-2 items-center p-5  w-[18vw] border-r-4 max-lg:flex-row max-lg:border-none max-lg:w-full max-lg:justify-around max-lg:items-center max-md:flex-col max-md:gap-10'>
      <div className='flex items-center gap-3 mb-6 max-lg:mb-0 '>
        <img src={assets.logo} alt="Logo" width={40} />
        <div className='text-2xl font-bold text-indigo-700 '>SkillLearnia</div>
      </div>

      <div className='flex flex-col gap-6 max-lg:flex-row max-md:flex-col'>
        <a href="/instructor-page/dashboard">
          <div className='flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-all'>
            <img src={assets.dashboard} alt="Dashboard Icon" width={25} />
            <div className='text-base text-slate-800 font-semibold'>Dashboard</div>
          </div>
        </a>

        <a href="/instructor-page/instructor-all-coureses">
          <div className='flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-all'>
            <img src={assets.course} alt="Courses Icon" width={25} />
            <div className='text-base text-slate-800 font-semibold'>Courses</div>
          </div>
        </a>

        <div className='flex justify-center'>
          <button
            onClick={handleLogout}
            className='border-2 border-rose-600 text-rose-600 font-medium rounded-lg px-6 py-2 hover:bg-rose-600 hover:text-white transition-all'
          >
            Logout
          </button>
        </div>
      </div>

    </div>

  )
}

export default SideBar