import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import BottomBar from './components/BottomBar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => setShowMenu(!showMenu)

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar toggleMenu={toggleMenu} />
      <div className='flex flex-1'>
        <Sidebar showMenu={showMenu} toggleMenu={toggleMenu} />
        <Outlet context={[showMenu]}/>
      </div>
      <BottomBar />
    </div>
  )
}

export default App
