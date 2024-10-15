import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Container from './components/Container.jsx'
import VideoCard from './components/VideoCard.jsx'
import BottomBar from './components/BottomBar.jsx'

function App() {
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => setShowMenu(!showMenu)

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar toggleMenu={toggleMenu} />
      <Sidebar showMenu={showMenu} toggleMenu={toggleMenu} />
      <div className='flex flex-1'>
        <Container showMenu={showMenu}>
          {Array.from({ length: 10 }).fill(1).map((_, i) => (
            <VideoCard key={i} />
          ))}
        </Container>
      </div>
      <BottomBar />
    </div>
  )
}

export default App
