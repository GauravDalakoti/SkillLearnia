import React, { useState } from 'react'
import { assets } from '../assets/assets'
import CourseLandingPage from '../components/courselandingpage/CourseLandingPage'
import Curriculam from '../components/curriculum/Curriculam'
import CourseSetting from '../components/courseSetting/CourseSetting'
import { toast, Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

const AddNewCourse = () => {

    const [currentSection, setCurrentSection] = useState("Curriculam");
    const [courseImage, setCourseImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const { courseDetails } = useSelector((state) => state.courseDetail);
    const { LandingImage } = useSelector((state) => state.landingImage);
    const { allLectures } = useSelector((state) => state.lecture);

    const renderSection = () => {
        switch (currentSection) {
            case "Curriculam":
                return <Curriculam isEdit={false} />;
            case "CourseLandingPage":
                return <CourseLandingPage />;
            case "CourseSetting":
                return <CourseSetting onFileChange={(file) => setCourseImage(file)} />;
            default:
                return <Curriculam isEdit={false} />;
        }
    };

    const handleSubmit = async () => {

        setLoading(true)
        const formData = new FormData()

        formData.append("courseImage", LandingImage);

        allLectures.forEach((curlecture, index) => {
            formData.append('lectures', curlecture.file);
            formData.append('lectureTitles', curlecture.title);
        });

        if (courseDetails) {
            formData.append("courseTitle", courseDetails.courseTitle)
            formData.append("Category", courseDetails.Category)
            formData.append("Pricing", courseDetails.Pricing)
            formData.append("Level", courseDetails.Level)
            formData.append("Primary_Language", courseDetails.Primary_Language)
            formData.append("Subtitle", courseDetails.Subtitle)
            formData.append("Description", courseDetails.Description)
            formData.append("Objective", courseDetails.Objective)
            formData.append("Welcome_Message", courseDetails.Welcome_Message)

            try {

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/add-new-course`, {

                    method: "POST",
                    credentials: "include",
                    headers: {

                        "Authorization": `Bearer ${localStorage.getItem("instructorToken")}`
                    },
                    body: formData
                })

                if (response.ok) {

                    setLoading(false)
                    toast.success("course details successfully uploaded")
                    localStorage.removeItem("courseDetails")
                    const res = await response.json();
                }

            } catch (error) {

                setLoading(false)
                toast.error("Error while uploading course details")
                console.log("Error while uploading the course details into the database")

            }
        }
    }

    return (

        <div>
            {loading ? (
                <div className="flex justify-center items-center p-6">
                    <img className="mx-auto" src={assets.loading} width={60} alt="" />
                </div>
            ) : (
                <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] p-4 sm:p-6 mx-auto">
                    <Toaster position="top-right" />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
                        <h1 className="text-xl sm:text-2xl font-bold text-indigo-700">
                            Add New Course
                        </h1>
                        <button
                            onClick={handleSubmit}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 sm:px-6 py-2 shadow-sm transition-all w-full sm:w-auto"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 border-2 border-slate-300 rounded-xl bg-slate-50 px-3 sm:px-4 py-3 w-full sm:w-fit shadow-sm">
                        <div
                            className="text-sm text-slate-800 font-medium hover:bg-indigo-100 px-3 py-2 rounded-md cursor-pointer transition-all text-center"
                            onClick={() => setCurrentSection('Curriculam')}
                            id="0"
                        >
                            Curriculam
                        </div>
                        <div
                            className="text-sm text-slate-800 font-medium hover:bg-indigo-100 px-3 py-2 rounded-md cursor-pointer transition-all text-center"
                            onClick={() => setCurrentSection('CourseLandingPage')}
                            id="1"
                        >
                            Course Landing Page
                        </div>
                        <div
                            className="text-sm text-slate-800 font-medium hover:bg-indigo-100 px-3 py-2 rounded-md cursor-pointer transition-all text-center"
                            onClick={() => setCurrentSection('CourseSetting')}
                            id="2"
                        >
                            Setting
                        </div>
                    </div>


                    {/* Section Content */}
                    <div className="h-[65vh] sm:h-[67vh] overflow-auto bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
                        {renderSection()}
                    </div>

                </div>
            )}
        </div>

    )
}

export default AddNewCourse