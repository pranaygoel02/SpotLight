import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function ProtectedRoute({children}) {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(state === null && (pathname.includes('phone') || pathname.includes('otp'))) {
      navigate('/')
    }
  },[state, navigate])
  
  useEffect(() => {
    const token = localStorage.getItem('token') 
    const appwriteCookieFallback = localStorage.getItem('cookieFallback')
    if ((!token || !appwriteCookieFallback) && pathname.includes('dashboard')) {
      navigate('/')
    }
    else if(token && (pathname.includes('login') || pathname.includes('signup'))) {
      navigate('/dashboard')
    }
  }, [localStorage, navigate])


  return (
    children
  )
}

export default ProtectedRoute