import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

const CourseProgress = () => {
  const { _id } = useParams();
  const [course, setCourse] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState({});
  const [courseStatus, setCourseStatus] = useState("pending");
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-current-course-and-lecture-progress/${_id}`,
          {
            method: "GET",
            credentials: "include",
             headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("userToken")}`
            },
          }
        );

        if (response.ok) {
          const res = await response.json();
          const courseData = res.data.course[0];
          setCourse(courseData || {});
          // set the first lecture (if exists) as the initially loaded lecture
          setCurrentLecture(courseData?.Lectures?.[0] ?? null);
          setCourseStatus(res.data.courseStatus);
          setIsCompleted(res.data.lectureObject || {});
          setCourseId(courseData?._id ?? "");
        }
      } catch (error) {
        console.log("Error fetching course data:", error);
      }
    })();
  }, [_id]);

  const handleEnded = async (id) => {
    setIsCompleted((prev) => ({ ...prev, [id]: true }));
    setIsPlaying(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/lecture/change-lecture-status/${id}/${courseId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const res = await response.json();
        
      }
    } catch (error) {
      console.log("Error while updating lecture status:", error);
    }
  };

  const handleCurrentLecture = (lecture) => {
    if (currentLecture?._id === lecture._id) {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setCurrentLecture(lecture);
      setIsPlaying(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.play();
      }, 0);
    }
  };

  // SAFELY determine if all lectures are completed
  const allLecturesCompleted =
    Array.isArray(course?.Lectures) &&
    course.Lectures.length > 0 &&
    course.Lectures.every((lec) => !!isCompleted[lec._id]);

  return (
    <div className="min-h-[90vh] bg-white text-gray-900 p-6 flex flex-col gap-8 transition-all duration-300">
      {/* Top completion banner */}
      {allLecturesCompleted && (
        <div className="w-full bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
          <img src={assets.completed} alt="Completed" className="w-6 h-6" />
          <span className="text-base sm:text-lg font-semibold">
            🎉 Congratulations! You’ve successfully completed this course.
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Video */}
        <div className="w-full lg:w-[70%] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              {course?.courseTitle ?? "Loading Course..."}
            </h2>
          </div>

          <div className="relative bg-gray-50">
            {currentLecture ? (
              <video
                key={currentLecture._id}
                ref={videoRef}
                controls
                onEnded={() => handleEnded(currentLecture._id)}
                src={currentLecture.lecture}
                className="w-full h-[35vh] sm:h-[55vh] lg:h-[70vh] object-cover rounded-b-2xl"
              />
            ) : (
              <div className="h-[35vh] sm:h-[55vh] lg:h-[70vh] flex items-center justify-center text-gray-500">
                Loading Lecture...
              </div>
            )}
          </div>
        </div>

        {/* Right: Curriculum */}
        <div className="w-full lg:w-[30%] bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <div className="bg-gray-100 text-gray-800 text-lg font-semibold text-center py-4 border-b border-gray-200">
            Course Curriculum
          </div>

          <div className="flex flex-col p-3 sm:p-4 h-[45vh] lg:h-[70vh] overflow-y-auto">
            {Array.isArray(course?.Lectures) && course.Lectures.length > 0 ? (
              course.Lectures.map((lecture) => {
                const isActive = currentLecture?._id === lecture._id;
                const completed = !!isCompleted[lecture._id];

                return (
                  <div
                    key={lecture._id}
                    onClick={() => handleCurrentLecture(lecture)}
                    className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-300 cursor-pointer
                      ${isActive
                        ? "bg-orange-100 text-gray-900 border border-orange-300"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-transparent"
                      }`}
                  >
                    <img
                      src={
                        completed
                          ? assets.completed
                          : isActive && isPlaying
                            ? assets.pause
                            : assets.play
                      }
                      alt=""
                      width={22}
                      className="flex-shrink-0"
                    />
                    <span className="truncate text-[15px] font-medium" title={lecture.title}>
                      {lecture.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">No lectures available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
