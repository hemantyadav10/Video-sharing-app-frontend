import React from 'react'
import VideoCard from '../components/VideoCard'
import Container from '../components/Container'
import { useOutletContext } from 'react-router-dom'
import { useFetchRandomVideos } from '../lib/queries/videoQueries'

function Home() {
  const [showMenu] = useOutletContext()
  const { data, isFetching, error } = useFetchRandomVideos()

  return (
    <Container showMenu={showMenu}>
      {isFetching &&
        Array.from({ length: 8 }).fill(1).map((_, i) => (
          <VideoCard key={i} loading={isFetching} />
        ))
      }
      {data?.data?.docs.map((video) => (
        <VideoCard
          key={video._id}
          videoData={video}
          loading={isFetching}
        />
      ))}
    </Container>
  )
}

export default Home
