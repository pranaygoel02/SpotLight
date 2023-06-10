import React from 'react'
// import { Link } from 'react-router-dom'

function Error() {
  return (
    <div className='m-auto h-screen w-screen justify-center items-center flex bg-black text-white'>
        <h1 className='font-bold text-center text-xl'>You are not at the authorized page. Please go back.</h1>
        {/* <Link to='/'>Go back</Link> */}
    </div>
  )
}

export default Error