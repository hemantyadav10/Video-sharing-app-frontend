import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom'
import BottomBar from './components/BottomBar.jsx'
import Navbar from './components/Navbar.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import Sidebar from './components/Sidebar.jsx'
import useIsOnline from './hooks/useIsOnline.js'

function App() {
  const [showMenu, setShowMenu] = useState(window.innerWidth < 1024 ? false : true)
  const { pathname } = useLocation()
  const isDashboardRoute = pathname === '/dashboard'
  const isVideoRoute = pathname.startsWith('/watch')
  const toggleMenu = () => setShowMenu(!showMenu)
  const isOnline = useIsOnline();

  useEffect(() => {
    if (showMenu && window.innerWidth < 768) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Add padding to match scrollbar width
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = ""; // Reset padding
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = ""; // Reset padding
    };
  }, [showMenu]);

  return (
    <div className='flex flex-col h-screen'>
      <ScrollRestoration />
      <Navbar toggleMenu={toggleMenu} />
      <div className='flex flex-1 pt-16'>
        {
          (!isDashboardRoute && !isVideoRoute) &&
          <Sidebar
            showMenu={showMenu}
            toggleMenu={toggleMenu}
          />
        }
        {showMenu && (!isDashboardRoute && !isVideoRoute) && <div onClick={() => toggleMenu()} className='fixed md:hidden inset-0  bg-black/80 z-[90]'></div>}

        <Outlet context={[showMenu]} />

      </div>
      {!isDashboardRoute && <BottomBar />}

      {!isOnline && <OfflineBanner />}
    </div>
  )
}

export default App
