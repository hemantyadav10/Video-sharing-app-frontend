import React, { useEffect, useState } from 'react'
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
      <div className='flex'>
        {!isDashboardRoute && <Sidebar showMenu={showMenu} toggleMenu={toggleMenu} />}
        <Outlet context={[showMenu]} />
      </div>
      {!isDashboardRoute && <BottomBar />}


    </div>
  )
}

export default App
