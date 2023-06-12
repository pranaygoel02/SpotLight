import React from 'react'
import { RiLoaderFill } from 'react-icons/ri'

function Loading({text}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <RiLoaderFill className="text-5xl animate-spin"/>
      <p className="text-xl">{text || 'Loading Data'}</p>
    </div>
  )
}

export default Loading