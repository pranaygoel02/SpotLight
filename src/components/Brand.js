import React from 'react'
import { Link } from 'react-router-dom'
function Brand({size,color}) {
  return (
    <div title='Home' className={`font-extrabold capitalize font-manrope ${color} text-${size}xl`}>
      <Link to={'/'}>Logo</Link>
    </div>
  )
}

export default Brand