import React from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { Link, NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='flex flex-col p-4 border-r border-neutral-200 gap-2'>
        <Link className='sidebar-link' to='/'>
            Logo
        </Link>
        <Link className='sidebar-link' to=''>Home</Link>
        <NavLink className='sidebar-link' to='events?filter=total'>Events</NavLink>
        <NavLink className='sidebar-link' to='account'>Account</NavLink>
        <NavLink className='sidebar-link' to='scrum'>Scrum</NavLink>
    </div>
  )
}

export default Sidebar