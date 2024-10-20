import React from 'react'
import VideoCard from '../components/VideoCard'
import Container from '../components/Container'
import { useOutletContext } from 'react-router-dom'
import { useFetchVideos } from '../lib/queries/videoQueries'

function Home() {
  const [showMenu] = useOutletContext()
  const { data, isLoading, error } = useFetchVideos()
  console.log(data?.data?.docs)

  return (
    <Container showMenu={showMenu}>
      {isLoading &&
        Array.from({ length: 8 }).fill(1).map((_, i) => (
          <VideoCard key={i} loading={isLoading} />
        ))
      }
      {data?.data?.docs.map((video) => (
        <VideoCard
          key={video._id}
          videoData={video}
          loading={isLoading}
        />
      ))}
    </Container>
  )
}

export default Home
