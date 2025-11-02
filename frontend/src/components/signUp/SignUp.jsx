import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function SignUp() {

    const [userData, setUserData] = useState({ username: "", email: "", password: "" })
    const [signUpType, setSignUpType] = useState('user');

    const navigate = useNavigate()

    const handleOptionChange = (event) => {
        setSignUpType(event.target.value);
    };

    const handleChange = (e) => {

        const id = e.target.id
        const value = e.target.value
        setUserData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        userData.role = signUpType

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/v1/user/register-user`, {

                method: "POST",
                credentials: "include",
                headers: {

                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            if (response.ok) {

                toast.success("SignUp Successfully")
                const res = await response.json()
                navigate("/sign-in")
            }

        } catch (error) {

            toast.error("Error while SignUp")
            console.log("Error while Sign Up", error)
        }
    }

    return (
        <div className='min-h-[86vh] flex justify-center items-center py-6 bg-slate-50'>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-6 border border-slate-300 rounded-2xl px-8 py-6 bg-white shadow-md w-[30vw] max-lg:w-[60vw] max-sm:w-[85vw]'
            >
                <h1 className='text-center text-3xl font-bold text-indigo-700'>Sign Up</h1>


                <div className='flex flex-col gap-2'>
                    <label htmlFor="username" className='text-md font-semibold text-slate-700'>Username</label>
                    <input
                        id='username'
                        type="text"
                        placeholder='Enter your username'
                        value={userData.username}
                        onChange={handleChange}
                        autoComplete='off'
                        className='outline-none border border-slate-300 rounded-lg py-3 px-4 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition'
                    />
                </div>


                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='text-md font-semibold text-slate-700'>Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder='Enter your email'
                        value={userData.email}
                        onChange={handleChange}
                        autoComplete='off'
                        className='outline-none border border-slate-300 rounded-lg py-3 px-4 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition'
                    />
                </div>


                <div className='flex flex-col gap-2'>
                    <label htmlFor="password" className='text-md font-semibold text-slate-700'>Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder='Enter your password'
                        value={userData.password}
                        onChange={handleChange}
                        autoComplete='off'
                        className='outline-none border border-slate-300 rounded-lg py-3 px-4 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition'
                    />
                </div>


                <div className='flex gap-8 items-center justify-start'>
                    <div className='flex items-center gap-2'>
                        <input
                            type="radio"
                            id="user"
                            value="user"
                            checked={signUpType === "user"}
                            onChange={handleOptionChange}
                            className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                            required
                        />
                        <label htmlFor="user" className='text-md font-medium text-slate-700'>User</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type="radio"
                            id="instructor"
                            value="instructor"
                            checked={signUpType === "instructor"}
                            onChange={handleOptionChange}
                            className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                        />
                        <label htmlFor="instructor" className='text-md font-medium text-slate-700'>Instructor</label>
                    </div>
                </div>


                <button
                    type='submit'
                    className='bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition w-full'
                >
                    Sign Up
                </button>


                <div className='text-center text-sm text-slate-600'>
                    Already have an account?
                    <Link to="/sign-in" className='text-indigo-600 hover:underline ml-1'>Sign In</Link>
                </div>
            </form>
        </div>

    )
}

export default SignUp