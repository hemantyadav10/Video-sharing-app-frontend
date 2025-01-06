import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar, { SidebarItem } from './components/Sidebar.jsx'
import BottomBar from './components/BottomBar.jsx'
import { Outlet, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard } from 'lucide-react'
import { HomeIcon } from '@radix-ui/react-icons'

function App() {
  const [showMenu, setShowMenu] = useState(false)
  const { pathname } = useLocation()
  const isDashboardRoute = pathname === '/dashboard'
  const isVideoRoute = pathname.startsWith('/watch')
  const toggleMenu = () => setShowMenu(!showMenu)

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


    </div>
  )
}

export default App
