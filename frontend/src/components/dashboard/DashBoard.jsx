import React, { useState } from 'react'
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const DashBoard = () => {

  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [coursePurchasedDetails, setCoursePurchasedDetails] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/course/course-purchased-details`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        setLoading(false)
        const res = await response.json();
        setTotalStudents(res.data.totalStudents)
        setTotalRevenue(res.data.totalRevenue)
        setCoursePurchasedDetails(res.data.arr)

      }
    })();
  }, []);

  return (
    <div className='w-[80vw] flex flex-col items-center gap-4 py-8 max-lg:w-[100vw]'>

      <div className='flex justify-between gap-4 bg-slate-100 w-[70vw] max-lg:w-[88vw] p-6 rounded-xl shadow-sm'>
        <div>
          <div className='text-sm text-slate-500 font-medium'>Student Enrolled</div>
          <div className='text-3xl font-bold text-slate-800 max-md:text-xl'>{totalStudents}</div>
        </div>
        <div>
          <div className='text-sm text-slate-500 font-medium'>Total Revenue</div>
          <div className='text-3xl font-bold text-emerald-600 max-md:text-xl'>₹ {totalRevenue}</div>
        </div>
      </div>

      <div className="bg-white w-[70vw] max-lg:w-[88vw] p-4 mb-4 mt-4 rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <h2 className="text-lg mb-6 text-slate-700 font-semibold">Student List</h2>

        <div className="h-[55vh] overflow-y-auto rounded-lg border border-gray-100">
          {loading ? (
            <div className="px-6 sm:px-12 py-3">
              <Skeleton />
              <Skeleton count={7} />
            </div>
          ) : coursePurchasedDetails.length > 0 ? (
            <div className="min-w-[600px]">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-100 text-slate-600 font-semibold text-sm uppercase border-b border-gray-200">
                <div className="py-3 px-5 text-left">Course</div>
                <div className="py-3 px-5 text-left">Student Name</div>
                <div className="py-3 px-5 text-left">Student Email</div>
              </div>

              {/* Table Body */}
              {coursePurchasedDetails.map((course, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 items-center text-gray-800 border-b border-gray-100 hover:bg-slate-50 transition-all"
                >
                  <div className="py-3 px-5  font-medium w-[18vw]">
                    {course.courseTitle}
                  </div>
                  <div className="py-3 px-5 ">{course.userName}</div>
                  <div className="py-3 px-5 text-blue-600 font-medium">
                    {course.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 font-medium">
              No students enrolled yet.
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DashBoard