import React from 'react'

const YourCourses = () => {
    return (
        <div>
            <div className='bg-gray-100 w-[70vw] p-4'>
                <div className='text-lg mb-4 text-gray-700 font-semibold' >student list</div>

                <div className='flex gap-28 overflow-y-auto'>

                    <div className='flex flex-col gap-1'>
                        <div className='text-md text-gray-700 font-semibold'>Course Name</div>
                        <div>machine learning</div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='text-md text-gray-700 font-semibold'>Student Name</div>
                        <div>machine learning</div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='text-md text-gray-700 font-semibold'>Student Email</div>
                        <div>machine learning</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default YourCourses