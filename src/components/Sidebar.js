import React, { useCallback, useEffect, useState } from 'react'
import { IoArrowBack, IoLogOut, IoPersonOutline } from 'react-icons/io5'
import { Link, NavLink } from 'react-router-dom'
import LogoutLogic from '../Logic/UserLogic.js/Logout.logic'
import client from '../appwrite.config'
import { Account } from 'appwrite'

function Sidebar() {
  const {logout} = LogoutLogic()
  const [userInfo, setUserInfo] = useState(null)

  const getUserInfo = useCallback(async () => {
    try {
      const account = new Account(client)
      const res = await account.get()
      console.log(res)
      localStorage.setItem('spotlight-user', JSON.stringify(res))
      setUserInfo(prev => res)
    }
    catch(err) {
      console.error(err)
    }
  },[])

  useEffect(() => {
    getUserInfo()
  },[getUserInfo])

  return (
    <div className='flex flex-col p-4 border-r border-neutral-200 gap-2'>
        

        <Link className='sidebar-link' to='/'>
            Logo
        </Link>
        <Link className='sidebar-link' to=''>Home</Link>
        <NavLink className='sidebar-link' to='events?filter=total'>Events</NavLink>
        <NavLink className='sidebar-link' to='invities'>Invities</NavLink>
        <div className='mt-auto flex flex-col'>
        <NavLink title={userInfo?.email} className='sidebar-link inline-flex items-center gap-1' to='account'>{userInfo ? <><IoPersonOutline/> {userInfo?.name.split(' ')[0]}</> : 'Account'}</NavLink>
        <button className='sidebar-link' onClick={logout}>Logout</button>
        </div>
        
    </div>
  )
}

export default Sidebar