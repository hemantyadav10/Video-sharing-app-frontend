import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomBar from './components/BottomBar.jsx'
import Navbar from './components/Navbar.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import Sidebar from './components/Sidebar.jsx'
import useIsOnline from './hooks/useIsOnline.js'

function App() {
  const [showMenu, setShowMenu] = useState(false)
  const { pathname } = useLocation()
  const isDashboardRoute = pathname === '/dashboard'
  const isVideoRoute = pathname.startsWith('/watch')
  const toggleMenu = () => setShowMenu(!showMenu)
  const isOnline = useIsOnline();

  

  return (
    <div className='flex flex-col h-screen'>
      <Navbar toggleMenu={toggleMenu} />
      <div className='flex flex-1 pt-16'>
        {
          (!isDashboardRoute && !isVideoRoute) &&
          <Sidebar
            showMenu={showMenu}
            toggleMenu={toggleMenu}
          />
        }
        {showMenu && <div onClick={() => toggleMenu()} className='fixed md:hidden inset-0 bg-black/70 z-[90]'></div>}

          <Outlet context={[showMenu]} />
      
      </div>
      {!isDashboardRoute && <BottomBar />}

      {!isOnline &&<OfflineBanner />}
    </div>
  )
}

export default App
