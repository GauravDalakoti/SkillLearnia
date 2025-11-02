import React, { useEffect, useState } from "react";
// import Home from "../components/home/Home";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FeaturesSection from "../components/featureSection/FeaturesSection";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-all-course`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const res = await response.json();
          setCourses([res.data[0], res.data[1], res.data[2], res.data[3], res.data[4], res.data[5]]);
        }
      } catch (error) {
        console.error("Error while fetching the course", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scrollToSection = () => {
    const targetSection = document.getElementById('target-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[87vh] bg-gradient-to-b from-gray-50 to-white">
      <section className="relative overflow-hidden py-16 px-6 sm:px-12 bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Left Section */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-gray-900 leading-snug">
              Level Up Your Career with
              <span className="bg-gradient-to-r from-orange-600 via-blue-500 to-green-500 bg-clip-text text-transparent font-extrabold ml-2">
                Expert-Led Courses
              </span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg max-w-lg">
              Explore industry-relevant programs designed to enhance your skills,
              boost your confidence, and help you stay ahead in the digital world.
            </p>

            <div className="flex gap-4 mt-4">
              <button onClick={scrollToSection} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                Explore Programs
              </button>
              <Link to="/all-courses"><button className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300">
                Learn More
              </button>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-green-400 opacity-20 blur-3xl rounded-full"></div>
            <img
              src={assets.home}
              alt="Learning illustration"
              className="relative rounded-2xl shadow-xl w-full max-w-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      <div className="text-center text-3xl sm:text-4xl font-bold mt-10 mb-6 text-gray-800">
        Explore Our Courses
      </div>
      <p className="text-center text-gray-600 mb-10 px-6 max-w-2xl mx-auto">
        Learn new skills, enhance your career, and grow with our expert-curated courses.
      </p>

      {loading ? (
        <div className="px-6 sm:px-12 py-3">
          <Skeleton height={250} count={6} className="mb-4 rounded-xl" />
        </div>
      ) : (
        <div id="target-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 sm:p-10">
          {courses.map((curcourse, index) => (


            <Link
              to={`/course-detail/${curcourse._id}`}
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  src={curcourse.courseImage}
                  alt={curcourse.courseTitle}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-white font-semibold text-lg">
                  View Details →
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {curcourse.courseTitle}
                </h2>

                <p className="text-gray-500 text-sm line-clamp-2">
                  {curcourse.courseDescription || "Expand your skills with this engaging and practical course."}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-700 font-medium text-lg">
                    ₹{curcourse.Pricing}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                    Enroll Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

      )}

      <Link to="/all-courses" className="flex items-center justify-center">
        <button
          className="group relative flex items-center justify-center gap-2 
               bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold
               shadow-md hover:bg-blue-700 transition-all duration-300 
               hover:shadow-lg active:scale-95"
        >
          View All Courses
          <span
            className="transform transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </Link>


      <FeaturesSection />
    </div>
  );
};

export default Courses;
