import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {IoArrowBack}   from 'react-icons/io5'
import {MdOutlineArrowBack}  from 'react-icons/md'

function AuthLayout() {
    const {pathname} = useLocation();
    const token = localStorage.getItem('token')
    const button = {
        text: pathname.includes('login') ? 'Sign Up' : 'Login',
        link: pathname.includes('login') ? '/auth/signup' : '/auth/login'
    }
    const pageTitle = pathname.includes('login') ? 'Sign in' : 'Create an account'
  return (
    <div className='p-4 min-h-screen grid grid-cols-2 text-black'>
        <div>
        {!token && <Link to='/' className='flex gap-1 font-bold items-center group  w-max rounded-[18px] transition-all duration-500'>
            <MdOutlineArrowBack
            className='bg-white rounded-full group-hover:bg-white group-hover:p-1 group-hover:text-black'
            size={24}/>
            <p className='text-white relative text-transparent group-hover:text-black translate-x-16 group-hover:translate-x-0 group-hover:block transition-all'>Go back</p>
        </Link>}
        <div className='flex flex-col h-full justify-center p-16 gap-4'>
            <h2 className='text-3xl font-bold'>{pageTitle}</h2>
            <Outlet/>
        </div>
        </div>
        <div className='rounded-[18px] relative p-4 bg-red-700'>
            {!token && <Link to={button.link} className='absolute bg-black text-white p-4 py-2 rounded-[18px] top-4 right-4'>{button.text}</Link>}
            <img src={''} />
        </div>
    </div>
  )
}

export default AuthLayout