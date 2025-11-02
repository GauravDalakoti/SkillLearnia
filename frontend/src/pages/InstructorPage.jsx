import React from 'react'

import { Outlet } from 'react-router-dom'
import SideBar from '../components/sidebar/SideBar.jsx'

const InstructorPage = () => {

    return (

        <div className='h-[100vh] flex max-lg:flex-col'>

            <SideBar />

            <Outlet />

        </div>
    )
}

export default InstructorPage