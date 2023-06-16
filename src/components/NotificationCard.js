import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)


function NotificationCard({userId, fromUserId, fromUserName, link, message, $createdAt }) {

  

  const time = dayjs($createdAt).fromNow(true)

  return (
    <div className='p-4 rounded-[18px] flex flex-row items-center gap-2 shadow outline outline-1 outline-neutral-200 bg-slate-100 relative'>
          <Avatar name={fromUserName} />
        <div className='relative'>
            <p className='text-sm font-semibold'>{fromUserName}</p>
            <p className='text-xs text-neutral-500'>{message}</p>
            {link && <Link to={link} target='_blank' className='text-xs text-neutral-500 sidebar-link outline outline-1 outline-neutral-300'>See event</Link>}
        </div>
        <p className='text-xs right-0 m-2 mx-4 absolute top-0 text-neutral-400'>{time} ago</p>
    </div>
  )
}

export default NotificationCard