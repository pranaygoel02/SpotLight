import React from 'react'
import { NavLink } from 'react-router-dom'
import Brand from './Brand'
import { footerLinks } from '../static/footerLinks'

function Footer() {
  return (
    <div className='flex flex-col gap-4 md:gap-8 py-12 bg-secondary text-neutral-200 font-poppins border-t border-neutral-400'>
    <div className='w-full flex flex-col md:flex-row items-start uppercase justify-between container'>
        <div className='flex flex-col items-start gap-2'>
            <Brand size={3} color={'white'}/>
            <p className='font-medium capitalize text-md '>Subtitle Lorem Ipsum!</p>
        </div>
        <div className='flex flex-col gap-2 md:gap-8 py-4 md:py-0 pt-8 md:pt-0' style={{flexBasis:'70%'}}>
        <div className='flex flex-col md:flex-row w-full justify-between gap-8'>
        <ul className='flex flex-col items-start gap-1'> 
            <li className='font-light text-sm '>About Us</li>
            <li className='font-light text-sm '>Contact Us</li>
        </ul>
        <ul className='flex flex-col items-start gap-1'> 
            <li className='font-light text-sm '>Terms & Conditions</li>
            <li className='font-light text-sm '>Privacy Policy</li>
        </ul>
        <ul className='flex flex-col items-start gap-1'> 
            <NavLink  className='font-light text-sm ' to={'/explore'}>Explore</NavLink>
            <NavLink  className='font-light text-sm ' to={`/dashboard`}>Dashboard</NavLink>
        </ul>
        </div>
        <div className='flex flex-col md:flex-row gap-2 w-full py-4 lg:py-0 lg:items-center font-manrope'>
            <h3 className=' font-bold capitalize text-2xl' style={{flexBasis:'25%'}}>Sign up for newsletter</h3>
            <form className='w-full flex-1 flex flex-row rounded-full overflow-hidden border'>
                <input type='email' placeholder='Enter your email' className='w-full p-2 pl-4 bg-transparent font-light focus:outline-none'/>
                <button type='submit' className='bg-accent text-white px-4 text-sm rounded-full'>Submit</button>
            </form>
        </div>
        </div>
    </div>
    <hr className='bg-neutral-100 border border-neutral-100 opacity-25'></hr>
    <ul className='md:w-full flex flex-row flex-wrap items-center justify-center gap-4'>
        {footerLinks.map((link, index) => 
        <li className='border flex items-center justify-center rounded-full p-2 hover:scale-125 transition-all'>
            <a className='' target={'_blank'} href={link.link} title={link.title}>{link.icon}</a>
        </li>
        )}
        
    </ul>
    <div>
        <p className='text-neutral-200 text-sm text-center'>&copy; {new Date().getFullYear()} | All rights reserved.</p>
    </div>
    </div>
  )
}

export default Footer