import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import CourseLandingPage from '../courselandingpage/CourseLandingPage'
import Curriculam from '../curriculum/Curriculam'
import CourseSetting from '../courseSetting/CourseSetting'
import { toast, Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setAllLectures } from '../../store/lectures'

const EditCourse = () => {

    const [currentSection, setCurrentSection] = useState("Curriculam");
    const [courseImage, setCourseImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const [currentCourse, setCurrentCourse] = useState({})

    const { courseId } = useParams()

    const { courseDetails } = useSelector((state) => state.courseDetail);
    const { LandingImage } = useSelector((state) => state.landingImage);
    const { allLectures } = useSelector((state) => state.lecture);

    useEffect(() => {

        (async () => {

            let _id = courseId
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
                    console.log(res)
                    setCurrentCourse(res.data[0])
                    dispatch(setAllLectures(res.data.Lectures))

                }

            } catch (error) {
                console.log("Error while fetching the course Details")
            }
        })()

    }, [])

    const renderSection = () => {
        switch (currentSection) {
            case "Curriculam":
                return <Curriculam isEdit={true} courseId={courseId} lectures={currentCourse?.Lectures} />;
            case "CourseLandingPage":
                return <CourseLandingPage isEdit={true} courseId={courseId} currentCourse={currentCourse} />;
            case "CourseSetting":
                return <CourseSetting isEdit={true} courseId={courseId} courseImage={currentCourse.courseImage} onFileChange={(file) => setCourseImage(file)} />;
            default:
                return <Curriculam isEdit={true} />;
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault()
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

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/update-course/${courseId}`, {

                    method: "POST",
                    credentials: "include",
                    body: formData
                })

                if (response.ok) {

                    setLoading(false)
                    toast.success("course details updated successfully")
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

            {
                loading ? <div><img className='mx-auto' src={assets.loading} width={60} alt="" /></div> :

                    <div className='w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] p-4 sm:p-6 mx-auto'>

                        <Toaster position='top-right' />

                        <div className='flex justify-between mb-3'>
                            <h1 className='text-xl font-extrabold'>Edit Course</h1>
                           
                        </div>

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


                        <div className='h-[70vh] overflow-auto max-lg:mx-auto '>

                            {
                                renderSection()
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default EditCourse