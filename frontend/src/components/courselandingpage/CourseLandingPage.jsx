import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setCourseDetail, setAllCourseDetails } from '../../store/courseDetail'
import { assets } from '../../assets/assets'

const CourseLandingPage = ({ isEdit, courseId, currentCourse }) => {

    // const [courseDetails, setCourseDetails] = useState({ courseTitle: "", Category: "", Pricing: "", Level: "", Primary_Language: "", Subtitle: "", Description: "", Objective: "", Welcome_Message: "", })

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();
    const { courseDetails } = useSelector(state => state.courseDetail)

    const handleChange = (e) => {

        dispatch(setCourseDetail({ field: e.target.id, value: e.target.value }));
        // setCourseDetails(prev => ({ ...prev, [event.target.id]: event.target.value }))
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        setLoading(true)

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/update-course-details/${courseId}`, {

                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
                },
                body: JSON.stringify(courseDetails)
            })

            if (response.ok) {

                setLoading(false)
                toast.success("course details Updated Succussfully")
                const res = await response.json();

            }

        } catch (error) {

            setLoading(false)
            toast.error("Error while uploading course details")
            console.log("Error while uploading user data into the database")
        }
    }

    useEffect(() => {

        if (isEdit) {

            (async () => {

                try {

                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/get-course-landing-details`, {

                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-type": "application/json",
                            'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
                        },
                        body: JSON.stringify({ courseId })
                    })

                    if (response.ok) {

                        const res = await response.json();

                        dispatch(setAllCourseDetails(res.data))

                    }

                } catch (error) {

                    toast.error("Error while fetching the course details")
                    console.log("Error while fetching the course details")
                }

            })()
        }
    }, [])


    const { allLectures } = useSelector((state) => state.lecture)

    return (

        <div>

            {
                loading ?
                    <div className="flex justify-center items-center p-6">
                        <img src={assets.loading} alt="Loading..." />
                    </div>
                    :


                    <div>


                        <Toaster position='top-right' />

                        {

                            isEdit ? (

                                <form
                                    onSubmit={handleSubmit}
                                    className='flex flex-col gap-6 border border-slate-300 rounded-2xl p-6 shadow-sm bg-white'
                                >
                                    <div className='flex items-center justify-between max-lg:flex-col max-lg:gap-6'>
                                        <div className='text-xl font-bold text-indigo-700'>Course Landing Page</div>
                                        <button type='submit' className='bg-blue-600  text-white hover:bg-blue-500 rounded-lg p-2 px-4 cursor-pointer'>
                                            Update Details
                                        </button>
                                    </div>
                                    {[
                                        { id: "courseTitle", label: "Title", placeholder: "Enter Course Title" },
                                        { id: "Category", label: "Category", placeholder: "Enter category" },
                                        { id: "Level", label: "Level", placeholder: "e.g. intermediate, easy" },
                                        { id: "Primary_Language", label: "Primary Language", placeholder: "e.g. English, Hindi" },
                                        { id: "Subtitle", label: "Subtitle", placeholder: "Enter Course Subtitle" },
                                        { id: "Description", label: "Description", placeholder: "Enter Course Description" },
                                        { id: "Pricing", label: "Pricing", placeholder: "Enter Course Pricing" },
                                        { id: "Objective", label: "Objective", placeholder: "Enter Course Objective" },
                                        { id: "Welcome_Message", label: "Welcome Message", placeholder: "Enter Welcome Message" }
                                    ].map((field) => (
                                        <div key={field.id} className='flex flex-col gap-1'>
                                            <label
                                                className='font-medium text-sm text-slate-700'
                                                htmlFor={field.id}
                                            >
                                                {field.label}
                                            </label>
                                            <input
                                                className='text-sm border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 rounded-lg px-3 py-2 outline-none transition-all'
                                                type='text'
                                                id={field.id}
                                                placeholder={field.placeholder}
                                                value={isEdit ? courseDetails[field.id] : courseDetails[field.id]}
                                                onChange={handleChange}
                                                required

                                            />
                                        </div>
                                    ))}


                                </form>
                            )

                                :

                                (

                                    <form
                                        onSubmit={handleSubmit}
                                        className='flex flex-col gap-6 border border-slate-300 rounded-2xl p-6 shadow-sm bg-white'
                                    >
                                        <div className='text-xl font-bold text-indigo-700'>Course Landing Page</div>

                                        {[
                                            { id: "courseTitle", label: "Title", placeholder: "Enter Course Title" },
                                            { id: "Category", label: "Category", placeholder: "Enter category" },
                                            { id: "Level", label: "Level", placeholder: "e.g. intermediate, easy" },
                                            { id: "Primary_Language", label: "Primary Language", placeholder: "e.g. English, Hindi" },
                                            { id: "Subtitle", label: "Subtitle", placeholder: "Enter Course Subtitle" },
                                            { id: "Description", label: "Description", placeholder: "Enter Course Description" },
                                            { id: "Pricing", label: "Pricing", placeholder: "Enter Course Pricing" },
                                            { id: "Objective", label: "Objective", placeholder: "Enter Course Objective" },
                                            { id: "Welcome_Message", label: "Welcome Message", placeholder: "Enter Welcome Message" }
                                        ].map((field) => (
                                            <div key={field.id} className='flex flex-col gap-1'>
                                                <label
                                                    className='font-medium text-sm text-slate-700'
                                                    htmlFor={field.id}
                                                >
                                                    {field.label}
                                                </label>
                                                <input
                                                    className='text-sm border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 rounded-lg px-3 py-2 outline-none transition-all'
                                                    type='text'
                                                    id={field.id}
                                                    placeholder={field.placeholder}
                                                    value={isEdit ? courseDetails[field.id] : courseDetails[field.id]}
                                                    onChange={handleChange}
                                                    required

                                                />
                                            </div>
                                        ))}


                                    </form>
                                )
                        }
                    </div>
            }
        </div>
    )
}

export default CourseLandingPage