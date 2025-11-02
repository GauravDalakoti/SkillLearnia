import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-student-enrolled-courses`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        )

        if (response.ok) {
          const res = await response.json()
          setMyCourses(res.data)
        }
      } catch (error) {
        console.log('Error while fetching the courses')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleCourse = (courseId) => {
    navigate(`/course-progress/${courseId}`)
  }

  return (
    <div className="min-h-[87vh] px-4 sm:px-8 py-10 bg-white">
      {loading ? (
        <div className="px-6 sm:px-12 py-3">
          <Skeleton height={30} width={200} />
          <Skeleton count={6} />
        </div>
      ) : myCourses?.length < 1 ? (
        <div className="text-2xl sm:text-3xl text-center py-10 font-semibold text-gray-700">
          No Courses Found
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h2 className="text-center text-3xl sm:text-4xl font-bold mb-10 text-gray-800">
            My Courses
          </h2>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myCourses.map((course, index) => (
              <div
                key={index}
                onClick={() => handleCourse(course._id)}
                className="bg-white shadow-md hover:shadow-xl border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <img
                  src={course.courseImage}
                  alt={course.courseTitle}
                  className="w-full h-48 sm:h-56 object-cover"
                />

                {/* Title */}
                <div className="flex-1 p-4">
                  <h3
                    className="text-lg sm:text-xl font-semibold text-gray-800 text-center truncate"
                    title={course.courseTitle}
                  >
                    {course.courseTitle}
                  </h3>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 pb-4">

                  {/* ✅ Status Badge */}
                  {course.status === 'completed' ? (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      Completed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0 3.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      Pending
                    </div>
                  )}


                  {/* Start Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCourse(course._id)
                    }}
                    className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCourses
