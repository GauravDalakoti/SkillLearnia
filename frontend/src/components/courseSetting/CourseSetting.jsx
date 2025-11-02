import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLandingImage } from '../../store/landingImage'
import { assets } from '../../assets/assets'

const CourseSetting = ({ isEdit, courseId, courseImage, onFileChange }) => {

  const [file, setFile] = useState(null)
  const [isSelected, setIsSelected] = useState(false)

  const { LandingImage } = useSelector((state) => state.landingImage);

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (LandingImage != null) {

      setIsSelected(true);
    }

  }, [LandingImage])

  const dispatch = useDispatch();

  const changeHandler = (e) => {

    setFile(e.target.files[0])
    setIsSelected(true)

    // Call the parent's handler to update the shared state
    if (onFileChange) {
      onFileChange(e.target.files[0]);
    }

    dispatch(setLandingImage(e.target.files[0]))
  }

  const handleUpload = async () => {

    setLoading(true)
    const formData = new FormData()

    formData.append("landingImage", LandingImage)
    formData.append("oldLandingImage", courseImage)

    try {

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/course/replace-landing-image/${courseId}`, {

        method: "POST",
        credentials: "include",
        body: formData
      })

      if (response.ok) {

        toast.success("landing image updated successfully")
        const res = await response.json();
        setLoading(false)
      }

    } catch (error) {

      setLoading(false)
      console.log("error while uploading the lecture")
    }

  }


  return (

    <div>
      {loading ?
        <div className="flex justify-center items-center p-6">
          <img src={assets.loading} alt="Loading..." />
        </div>
        :

        <div className='flex flex-col gap-6 border border-slate-300 rounded-2xl p-6 bg-white shadow-sm'>


          {isEdit ? <>

            <div className='flex justify-between items-center max-lg:flex-col max-lg:gap-4'>
              <div
                className='text-2xl font-bold text-indigo-700 cursor-pointer hover:underline'
               
              >
                Course Settings
              </div>
              <div onClick={handleUpload} className='bg-blue-600 text-white hover:bg-blue-500 rounded-lg p-2 px-4 cursor-pointer'>
                Upload
              </div>

            </div>

            <div className='flex flex-col gap-3'>
              <label className='font-medium text-slate-700 text-sm'>Upload Updated Course Image</label>

              <input
                type='file'
                onChange={changeHandler}
                required
                className='block w-fit text-sm text-slate-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-indigo-50 file:text-indigo-700
                 hover:file:bg-indigo-100 cursor-pointer transition-all'
              />

              {isSelected ? (
                <img
                  src={URL.createObjectURL(LandingImage)}
                  alt='Preview'
                  className='object-cover h-64 w-64 rounded-lg border border-slate-300 shadow-md'
                />
              ) : <img
                src={courseImage}
                alt='Preview'
                className='object-cover h-64 w-64 rounded-lg border border-slate-300 shadow-md'
              />}
            </div></>
            : <>

              <div
                className='text-2xl font-bold text-indigo-700 cursor-pointer hover:underline'
                
              >
                Course Settings
              </div>

              <div className='flex flex-col gap-3'>
                <label className='font-medium text-slate-700 text-sm'>Upload Course Image</label>

                <input
                  type='file'
                  onChange={changeHandler}
                  required
                  className='block w-fit text-sm text-slate-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-indigo-50 file:text-indigo-700
                 hover:file:bg-indigo-100 cursor-pointer transition-all'
                />

                {isSelected && (
                  <img
                    src={URL.createObjectURL(LandingImage)}
                    alt='Preview'
                    className='object-cover h-64 w-64 rounded-lg border border-slate-300 shadow-md'
                  />
                )}
              </div></>
          }



        </div>
      }
    </div>
  )
}

export default CourseSetting