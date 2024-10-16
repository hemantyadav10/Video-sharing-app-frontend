import React from 'react'
import VideoCard from '../components/VideoCard'
import Container from '../components/Container'
import { useOutletContext } from 'react-router-dom'

function Home() {
  const [showMenu] = useOutletContext()

  return (
    <Container showMenu={showMenu}>
      {Array.from({ length: 10 }).fill(1).map((_, i) => (
        <VideoCard key={i} />
      ))}
    </Container>
  )
}

export default Home
