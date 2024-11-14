import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import BottomBar from './components/BottomBar.jsx'
import { Outlet, useLocation } from 'react-router-dom'

function App() {
  const [showMenu, setShowMenu] = useState(false)
  const { pathname } = useLocation()
  const isDashboardRoute = pathname === '/dashboard'
  const toggleMenu = () => setShowMenu(!showMenu)

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar toggleMenu={toggleMenu} />
      <div className='flex flex-1'>
        {!isDashboardRoute && <Sidebar showMenu={showMenu} toggleMenu={toggleMenu} />}
        <Outlet context={[showMenu]} />
      </div>
      <BottomBar />
    </div>
  )
}

export default App
