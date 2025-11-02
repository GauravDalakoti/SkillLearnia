import React, { useEffect } from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets.js'
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { setAllLectures, updateLectureTitle, setAllApiLectures } from '../../store/lectures.js';

const Curriculam = ({ isEdit, courseId, lectures }) => {

    const [uploadedLecture, setUploadedLecture] = useState([]);

    const [replacedFiles, setReplacedFiles] = useState({});

    const [isSelected, setIsSelected] = useState(false);

    const [isUploaded, setIsUploaded] = useState(false)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();

    const [toogleButton, setToggleButton] = useState(assets.toogleoff)

    const handleToogleButton = (e) => {

        if (toogleButton === assets.toogleoff) {

            setToggleButton(assets.toogleon)
        }
        else {
            setToggleButton(assets.toogleoff)
        }
    }

    const { allLectures } = useSelector((state) => state.lecture)

    useEffect(() => {

        if (!isEdit && allLectures.length > 0) {

            setIsSelected(true)
        }

    }, [allLectures])

    if (isEdit) {

        useEffect(() => {
            dispatch(setAllApiLectures(lectures))
        }, [lectures])

    }

    // Function to handle adding multiple files
    const handleAddLectures = (files) => {
        const newLectures = Array.from(files).map((file) => ({
            file, title: "", // Default title is empty
        }));
        // setLectures((prev) => [...prev, ...newLectures]);
        dispatch(setAllLectures(newLectures))
        setIsSelected(true);
    };

    const handleFileChange = (e, _id, title) => {
        const newFile = e.target.files[0];
        setReplacedFiles((prev) => ({
            ...prev,
            [_id]: newFile,
        }));

    };

    const handleCancel = (_id) => {
        setReplacedFiles((prev) => {
            const updated = { ...prev };
            delete updated[_id];
            return updated;
        });
    };

    const cancelNewLecture = () => {

        dispatch(setAllApiLectures(lectures))
    }

    const handleLectureTitle = (index, e) => {
        dispatch(updateLectureTitle({ index, title: e.target.value }));
    };

    const handleDeleteLecture = async (id) => {

        setLoading(true)
        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/lecture/delete-lecture/${id}/${courseId}`, {

                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
                }
            })

            if (response.ok) {

                setLoading(false)
                toast.success("lecture deleted Successfully")
                const res = await response.json();
                dispatch(setAllApiLectures(res.data.Lectures))

            }

        } catch (error) {

            setLoading(false)
            console.log("error while uploading the lecture")
        }
    }


    const handelUpload = async (_id) => {

        setLoading(true)
        const formData = new FormData()
        const file = replacedFiles[_id]
        const lecture = allLectures.filter((lecture) => lecture._id === _id)

        formData.append("replacedLecture", file)
        formData.append("replacedLectureTitle", lecture[0].title)
        formData.append("oldLectureUrl", lecture[0].lecture)

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/lecture/replace-lecture/${_id}/${courseId}`, {

                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("instructorToken")}`
                },
                body: formData
            })

            if (response.ok) {

                toast.success("lecture updated Successfully")
                const res = await response.json();
                setReplacedFiles({})
                dispatch(setAllApiLectures(res.data.Lectures))
                setLoading(false)
            }
            else {
                setLoading(false)
            }

        } catch (error) {

            setLoading(false)
            console.log("error while uploading the lecture")
        }

    }


    const addNewLecture = async (_id) => {

        setLoading(true)
        const formData = new FormData()
        const lecture = allLectures.filter((lecture) => lecture._id === _id)

        formData.append("newLecture", lecture[0].file)
        formData.append("newLectureTitle", lecture[0].title)

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/lecture/add-new-lecture/${courseId}`, {

                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("instructorToken")}`

                },
                body: formData
            })

            if (response.ok) {

                toast.success("new lecture added Successfully")
                const res = await response.json();
                dispatch(setAllApiLectures(res.data.Lectures))
                setLoading(false)
            }
            else {
                setLoading(false)
            }

        } catch (error) {

            setLoading(false)
            console.log("error while adding a new lecture")
        }

    }

    const updateLecturesTitleDetail = async () => {

        setLoading(true)

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/lecture/update-lecture-title/${courseId}`, {

                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("instructorToken")}`
                },
                body: JSON.stringify({ allLectures })
            })

            if (response.ok) {

                toast.success("all lectures titles updated Successfully")
                const res = await response.json();
                dispatch(setAllApiLectures(res.data.Lectures))
                setLoading(false)
            }

        } catch (error) {

            setLoading(false)
            console.log("error while adding a new lecture")
        }
    }


    return (

        <div>
            <Toaster position="top-right" />
            {loading ? (
                <div className="flex justify-center items-center p-6">
                    <img src={assets.loading} alt="Loading..." />
                </div>
            ) : (isEdit ? <div className="flex flex-col gap-6 border border-slate-300 rounded-2xl px-4 sm:px-6 py-5 bg-white shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-base sm:text-lg font-bold text-indigo-700">
                        Update Course Curriculum
                    </h1>


                </div>

                {/* Add Lecture Button */}

                <div className='flex items-center justify-between max-lg:flex-col max-lg:gap-4'>
                    <div>
                        <label
                            htmlFor="newLecture"
                            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-transform transform hover:scale-105"
                        >
                            <input
                                className="hidden"
                                id="newLecture"
                                type="file"
                                onChange={(e) => handleAddLectures(e.target.files)}
                            />
                            Add New Lecture
                        </label>
                    </div>

                    <div >
                        <button onClick={updateLecturesTitleDetail} className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg'>Update Lectures Title</button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {allLectures?.map((lecture, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-4 border border-slate-300 rounded-lg p-4 bg-indigo-50 shadow"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full sm:w-[50vw]">
                                <div className="flex gap-3 items-center w-full">
                                    <div className="font-semibold text-indigo-900">
                                        Lecture {index + 1}
                                    </div>
                                    <input
                                        onChange={(e) => handleLectureTitle(index, e)}
                                        value={lecture.title}
                                        className="flex-1 text-sm outline-none border border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                        type="text"
                                        placeholder="Enter Lecture Title"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                                {replacedFiles[lecture._id] ? (
                                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                                        <video className="w-full sm:w-72 h-48 rounded-lg" controls>
                                            <source
                                                src={URL.createObjectURL(replacedFiles[lecture._id])}
                                                type="video/mp4"
                                            />
                                        </video>

                                        <div className='flex items-start mt-2 gap-4'>
                                            <button
                                                className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm transition w-full sm:w-auto"
                                                onClick={() => handelUpload(lecture._id)}
                                            >
                                                Upload
                                            </button>
                                            <button
                                                onClick={() => handleCancel(lecture._id)}
                                                className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition w-full sm:w-auto"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <video className="w-full sm:w-72 h-48 rounded-lg" controls>
                                            <source src={lecture.lecture?.startsWith("https://") ? lecture.lecture : URL.createObjectURL(lecture.file)} type="video/mp4" />
                                        </video>

                                        {lecture.lecture?.startsWith("https://") ?
                                            <div className="flex flex-col gap-3 mt-4 w-full sm:w-auto">
                                                <label
                                                    htmlFor={`replace-${lecture._id}`}
                                                    className="flex items-center max-lg:flex-col gap-2 text-sm text-white bg-green-600 border border-indigo-300 rounded-lg px-3 py-2 hover:bg-green-500 cursor-pointer transition"
                                                >
                                                    <input
                                                        className="hidden"
                                                        id={`replace-${lecture._id}`}
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, lecture._id)}
                                                    />
                                                    Replace Video
                                                </label>

                                                <button
                                                    onClick={() => handleDeleteLecture(lecture._id)}
                                                    className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition w-full sm:w-auto"
                                                >
                                                    Delete Lecture
                                                </button>
                                            </div>

                                            :
                                            <div className='flex items-start mt-2 gap-4'>
                                                <button
                                                    className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm transition w-full sm:w-auto"
                                                    onClick={() => addNewLecture(lecture._id)}
                                                >
                                                    Upload
                                                </button>
                                                <button
                                                    onClick={cancelNewLecture}
                                                    className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition w-full sm:w-auto"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

                : (
                    <div className="flex flex-col gap-6 border border-slate-300 rounded-2xl px-4 sm:px-6 py-5 bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h1 className="text-base sm:text-lg font-bold text-indigo-700">
                                Create Course Curriculum
                            </h1>

                            <label
                                htmlFor="bulkUpload"
                                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md px-3 py-1 hover:bg-indigo-50 cursor-pointer transition"
                            >
                                <img src={assets.upload} alt="Upload Icon" width={16} />
                                <input
                                    className="hidden"
                                    id="bulkUpload"
                                    type="file"
                                    onChange={(e) => handleAddLectures(e.target.files)}
                                    multiple
                                />
                                Bulk Upload
                            </label>
                        </div>

                        {/* Add Lecture Button */}
                        <div>
                            <label
                                htmlFor="newLecture"
                                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-transform transform hover:scale-105"
                            >
                                <input
                                    className="hidden"
                                    id="newLecture"
                                    type="file"
                                    onChange={(e) => handleAddLectures(e.target.files)}
                                />
                                Add Lecture
                            </label>
                        </div>

                        {/* Add Lecture Manually */}
                        {!isSelected && (
                            <div className="flex flex-col gap-4 border border-slate-300 rounded-lg p-4 bg-indigo-50 w-full sm:w-[50vw] shadow-sm">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="font-semibold text-indigo-900">Lecture 1</div>
                                        <input
                                            className="text-sm outline-none border border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto"
                                            type="text"
                                            id="lecture1"
                                            placeholder="Enter Lecture Title"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => handleAddLectures(e.target.files)}
                                        required
                                        className="text-sm text-indigo-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Lectures Not Uploaded Yet */}
                        {isSelected && !isUploaded && (
                            <div className="flex flex-col gap-6">
                                {allLectures.map((lecture, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-4 border border-slate-300 rounded-lg p-4 bg-indigo-50 shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full sm:w-[50vw]">
                                            <div className="flex gap-3 items-center w-full max-lg:flex-col">
                                                <div className="font-semibold text-indigo-900">
                                                    Lecture {index + 1}
                                                </div>
                                                <input
                                                    onChange={(e) => handleLectureTitle(index, e)}
                                                    value={lecture.title}
                                                    className="flex-1 text-sm max-lg:w-[60vw] outline-none border border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                                    type="text"
                                                    placeholder="Enter Lecture Title"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            <video className="w-full sm:w-72 h-48 rounded-lg" controls>
                                                <source
                                                    src={URL.createObjectURL(lecture.file)}
                                                    type="video/mp4"
                                                />
                                            </video>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Uploaded Lectures */}
                        {isUploaded && (
                            <div className="flex flex-col gap-6">
                                {uploadedLecture.map((curlecture, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-4 border border-slate-300 rounded-lg p-4 bg-indigo-50 shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full sm:w-[50vw]">
                                            <div className="flex gap-3 items-center w-full max-lg:flex-col">
                                                <div className="font-semibold text-indigo-900">
                                                    Lecture {index + 1}
                                                </div>
                                                <input
                                                    value={curlecture.title}
                                                    className="flex-1 text-sm max-lg:w-[60vw] outline-none border border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                                    type="text"
                                                    placeholder="Enter Lecture Title"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            <video className="w-full sm:w-72 h-48 rounded-lg" controls>
                                                <source src={curlecture.lecture} type="video/mp4" />
                                            </video>
                                            <div className="flex flex-col gap-3 w-full sm:w-auto">
                                                <button className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition w-full sm:w-auto">
                                                    Replace Video
                                                </button>
                                                <button className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition w-full sm:w-auto">
                                                    Delete Lecture
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )

            )}
        </div>


    )
}

export default Curriculam

