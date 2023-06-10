import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'

function LandingLayout() {

    const {pathname} = useLocation();
    
    
  return (
    <div className='min-h-screen flex flex-col'>
        { !pathname.includes('auth') && <Navbar/>}
        <div className='flex-1'>
        <Outlet/>
        </div>
        {!pathname.includes('auth') && <Footer/>}
    </div>
  )
}

export default LandingLayout