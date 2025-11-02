import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const CourseDetail = () => {

  const { _id } = useParams();

  const navigate = useNavigate();

  const [course, setcourse] = useState({});

  useEffect(() => {

    (async () => {

      try {

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-current-course`, {

          method: "POST",
          credentials: "include",
          headers: {

            "Content-Type": "application/json"
          },
          body: JSON.stringify({ _id })
        })

        if (response.ok) {

          const res = await response.json();
          setcourse(res.data[0])
        
        }

      } catch (error) {
        console.log("Error while fetching the course")
      }
    })()

  }, [])


  const handleCoursePurchase = async (e) => {

    e.preventDefault()

    const token = localStorage.getItem("userToken")

    if (!token) {

      navigate("/sign-in")
    }

    else {
      const courseId = _id

      try {

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/purchase/checkout/create-checkout-session`, {

          method: "POST",
          credentials: "include",
          headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("userToken")}`
            },
          body: JSON.stringify({ courseId })
        })

        if (response.ok) {

          const res = await response.json();
          window.location.href = res.data
        }

      } catch (error) {
        console.log("Error while puchase the course", error);
      }
    }
  }


  return (
    <div className="min-h-[87vh]">
      <div className="flex flex-col gap-6 mx-4 sm:mx-6 my-6">
        {/* Course Header */}
        <div className="flex flex-col gap-4 rounded-lg bg-slate-800 p-6 text-white">
          <div className="text-xl sm:text-2xl font-semibold">
            {course.courseTitle} Full Course
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6">
            {/* Created On */}
            <div className="flex items-center gap-1">
              <div className="text-sm">Created on:</div>
              <div className="text-sm">{course.createdAt?.slice(0, 10)}</div>
            </div>

            {/* Language */}
            <div className="flex items-center gap-1">
              <div className="text-sm">Language:</div>
              <div className="text-sm">{course.Primary_Language}</div>
            </div>

            {/* Learners */}
            <div className="flex items-center gap-1">
              <div className="text-sm">Learners:</div>
              <div className="text-sm">10</div>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="border-gray-300 rounded-lg border-2 p-6 shadow-md">
          <div className="text-lg font-semibold mb-2">Course Description</div>
          <div className="text-gray-600">{course.Description}</div>
        </div>

        {/* Course Curriculum & Pricing */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Curriculum */}
          <div className="border-gray-300 rounded-lg border-2 p-6 flex-1 shadow-md">
            <div className="text-lg font-semibold mb-3">Course Curriculum</div>
            <div className="flex flex-col gap-2">
              {course.Lectures?.map((curlecture, index) => (
                <div className="flex gap-3 items-center" key={index}>
                  <img
                    src={assets.play}
                   
                    alt=""
                    className="w-7 h-7 cursor-pointer"
                  />
                  <div className="text-base sm:text-lg font-semibold">
                    {curlecture.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="border-gray-300 rounded-lg border-2 p-6 flex-1 shadow-md">
            <div className="text-lg font-semibold mb-3">Course Pricing</div>
            <div className="flex flex-col gap-4">
              <div className="text-xl sm:text-2xl font-extrabold">
                ₹ {course.Pricing}
              </div>
              <button
                onClick={handleCoursePurchase}
                className="text-white bg-gray-800 hover:bg-black rounded-lg py-2 px-5 w-full"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CourseDetail