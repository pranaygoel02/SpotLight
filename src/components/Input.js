import React from 'react'

function Input({ type, placeholder, value, cb, leftIcon, rightIcon}) {
  return (
        <div className='p-2 border-b border-neutral-300 bg-transparent w-full inline-flex font-poppins'>
            {leftIcon}
            <input type={type} onChange={(e)=>cb(prev => e.target.value)} value={value} placeholder={placeholder}  className='p-2 w-full bg-transparent focus-within:outline-none focus-within:border-none'/>
            {rightIcon}
        </div>
  )
}

export default Input