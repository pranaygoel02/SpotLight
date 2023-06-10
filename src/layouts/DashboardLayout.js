import React from 'react'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
        sidebar
        <Outlet/>
    </div>
  )
}

export default DashboardLayout