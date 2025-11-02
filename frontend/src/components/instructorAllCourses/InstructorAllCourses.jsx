import React from 'react'
import { assets } from '../../assets/assets'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const InstructorAllCourses = () => {

  const [courses, setCourses] = useState([])

  const [showDelete, setShowDelete] = useState(false)

  const [currentCourseId, setCurrentCourseId] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const confirmDelete = async (e) => {

    e.preventDefault()
    try {

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/delete-course`, {

        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
        },
        body: JSON.stringify({ currentCourseId })
      })

      if (response.ok) {

        toast.success("Course Deleted Successfully")
        const res = await response.json();
      }

    } catch (error) {
      toast.error("Error while deleting the course")
      console.log("Error while fetching the course")
    }

  }

  useEffect(() => {

    (async () => {

      setLoading(true)
      try {

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-instructor-courses`, {

          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
          }
        })

        if (response.ok) {

          setLoading(false)
          const res = await response.json();
          setCourses(res.data)
        }

      } catch (error) {
        setLoading(false)
        console.log("Error while fetching the course")
      }

    })()

  }, [])

  const handleDelete = (e, id) => {

    setCurrentCourseId(id)
    setShowDelete(true)
  }

  const closeDelete = () => {

    setShowDelete(false)
  }

  const handleEdit = (e, courseId) => {

    navigate(`/instructor-page/edit-course/${courseId}`)
  }

  return (

    <div className='h-[100vh] w-[80vw] py-10 max-lg:w-[100vw] max-lg:px-10 max-md:px-2 max-md:py-4'>

      <div className='flex items-center justify-between px-8 max-md:flex-col'>
        <div className='text-xl font-extrabold text-slate-800 mb-4'>All Courses</div>
        <a href="/instructor-page/add-new-course">
          <div className='text-sm rounded-md px-4 py-2 transition-transform hover:scale-105 bg-indigo-600 text-white font-semibold mb-4 shadow-md'>
            Add New Course
          </div>
        </a>
      </div>

      <div className='bg-slate-100 w-[70vw] max-h-[80vh] p-6 mx-auto overflow-x-auto rounded-xl shadow-sm max-lg:w-[90vw]'>

        <div className=''>
          <div className='text-lg mb-6 text-slate-700 font-semibold'>Student List</div>

          {loading ? (
            <div className="px-6 sm:px-12 py-3">
              <Skeleton />
              <Skeleton count={7} />
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              {
                courses.map((currentCourse, index) => (
                  <div
                    key={index}
                    className='flex max-lg:flex-col max-lg:gap-4 gap-24 bg-white border border-slate-300 rounded-xl p-6 hover:bg-slate-50 shadow-sm transition-all'
                  >
                    <div className='flex flex-col gap-1 '>
                      <div className='text-md text-slate-500 font-medium'>Course</div>
                      <div className='w-40 text-slate-800 font-semibold'>{currentCourse.courseTitle}</div>
                    </div>
                    <div className='flex flex-col gap-1 max-lg:flex-row max-lg:gap-2'>
                      <div className='text-md text-slate-500 font-medium'>Students</div>
                      <div className='text-slate-800'>{currentCourse.enrolledStudents?.length}</div>
                    </div>
                    <div className='flex flex-col gap-1 max-lg:flex-row max-lg:gap-3'>
                      <div className='text-md text-slate-500 font-medium '>Revenue</div>
                      <div className='text-emerald-600 font-semibold'>
                        ₹ {currentCourse?.Pricing * currentCourse.enrolledStudents?.length}
                      </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='text-md text-slate-500 font-medium'>Actions</div>
                      <div className='flex items-center gap-3'>
                        <img
                          onClick={(e) => handleEdit(e, currentCourse._id)}
                          className='hover:scale-110 transition-transform cursor-pointer'
                          src={assets.edit}
                          alt="Edit"
                          width={25}
                        />
                        <img
                          onClick={(e) => handleDelete(e, currentCourse._id)}
                          className='hover:scale-110 transition-transform cursor-pointer'
                          src={assets.remove}
                          alt="Delete"
                          width={25}
                        />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-2 rounded-2xl border-slate-300 
                    w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] 
                    p-6 sm:p-8 md:p-10 
                    flex flex-col gap-6 shadow-lg">

            {/* Message */}
            <div className="text-center font-semibold text-slate-800 text-base sm:text-lg">
              Are you sure you want to delete this course?
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
              <button
                onClick={closeDelete}
                className="w-full sm:w-auto border border-slate-400 text-slate-700 font-medium text-sm rounded-md py-2 px-4 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={(e) => confirmDelete(e, currentCourse._id)}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 rounded-md font-medium text-sm text-white py-2 px-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  )
}

export default InstructorAllCourses