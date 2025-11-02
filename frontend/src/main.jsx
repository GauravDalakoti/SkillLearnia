import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, Router, RouterProvider } from 'react-router-dom'
import Courses from './pages/Courses.jsx'
import AllCourses from './pages/AllCourses.jsx'
import Subscription from './pages/Subscription.jsx'
import Login from './components/login/Login.jsx'
import SignUp from './components/signUp/SignUp.jsx'
import { Provider } from 'react-redux'
import store from './store/store'
import InstructorPage from './pages/InstructorPage'
import SecuredRoute from './components/securedRoute/SecuredRoute.jsx'
import PageNotFound from './components/pageNotFound/PageNotFound.jsx'
import InstructorAllCourses from './components/instructorAllCourses/InstructorAllCourses.jsx'
import DashBoard from './components/dashboard/DashBoard.jsx'
import AddNewCourse from './pages/AddNewCourse.jsx'
import CourseDetail from './components/courseDetail/CourseDetail.jsx'
import CourseProgress from './components/courseProgress/CourseProgress.jsx'
import MyCourses from './components/myCourses/MyCourses.jsx'
import RefreshAccessToken from './components/refreshAccessToken/RefreshAccessToken.jsx'
import EditCourse from './components/editCourse/EditCourse.jsx'

const router = createBrowserRouter(

  createRoutesFromElements(

    <>
      <Route path='/' element={<App />}>

        <Route path='' element={<Courses />} />
        <Route path='/home' element={<Courses />} />
        <Route path='/course-detail/:_id' element={<CourseDetail />} />
        <Route path='/all-courses' element={<AllCourses />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/sign-in' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/my-courses' element={<MyCourses />} />
        <Route path='/refresh-token' element={<RefreshAccessToken />} />
        <Route path='/course-progress/:_id' element={<CourseProgress />} />
        <Route path='*' element={<PageNotFound />} />

      </Route>

      <Route path='instructor-page' element={<SecuredRoute ><InstructorPage /></SecuredRoute>} >

        <Route path='/instructor-page' element={<DashBoard />} />
        <Route path='/instructor-page/dashboard' element={<DashBoard />} />
        <Route path='/instructor-page/instructor-all-coureses' element={<InstructorAllCourses />} />
        <Route path='/instructor-page/add-new-course' element={<AddNewCourse />} />
        <Route path='/instructor-page/edit-course/:courseId' element={<EditCourse />} />

      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider future={{ v7_partialHydration: true }} router={router}>



    </RouterProvider>
  </Provider >

)