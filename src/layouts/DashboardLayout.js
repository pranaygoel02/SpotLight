import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function DashboardLayout() {
  return (
    <div className='w-full flex h-full'>
        <Sidebar/>
        <div className='overflow-auto w-full p-4'>
          <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout