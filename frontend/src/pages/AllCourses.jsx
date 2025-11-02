import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllCourses = () => {

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
                    setCourses(res.data);
                }
            } catch (error) {
                console.error("Error while fetching the course", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className='min-h-[87vh]'>


            {loading ? (
                <div className="px-6 sm:px-12 py-3">
                    <Skeleton height={250} count={6} className="mb-4 rounded-xl" />
                </div>
            ) : (

                <div>

                    <div className="text-center text-3xl sm:text-4xl font-bold mt-10 mb-6 text-gray-800">
                        Explore Our All Courses
                    </div>
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
                </div>
            )}

        </div>
    )
}

export default AllCourses