import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Settings from './pages/Settings'
import ProfilePage from './pages/ProfilePage'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUP from './pages/SignUP'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast';


const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const {theme} = useThemeStore()

  console.log({ onlineUsers })

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser })

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div data-theme={theme}>

      <Navbar />

      <Routes>
        <Route path='/' element={ authUser ? <Home /> : <Navigate to='/login'/>} />
        <Route path='/signup' element={ !authUser ? <SignUP /> : <Navigate to='/' />} />
        <Route path='/login' element={ !authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App
