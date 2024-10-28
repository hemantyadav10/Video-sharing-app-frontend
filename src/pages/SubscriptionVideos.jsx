import React from 'react'
import VideoCard from '../components/VideoCard'
import { Link, useOutletContext } from 'react-router-dom'
import Container from '../components/Container'
import { Button } from '@radix-ui/themes'
import { useFetchSubscribedChannelVideos } from '../lib/queries/subscriptionQueries'
import { useAuth } from '../context/authContext'

function SubscriptionVideos() {
  const [showMenu] = useOutletContext()
  const { user } = useAuth()
  const { data: videos, isLoading } = useFetchSubscribedChannelVideos(user?._id)
  console.log(videos?.data.docs)

  return (
    <div className='w-full py-6'>
      <div className='flex items-center justify-between px-4 md:px-6 lg:px-10'>
        <span className='text-xl font-semibold'>Latest</span>
        <Link to={'/subscriptions/channels'}>
          <Button hidden={!user} size={'2'} radius='full' className='font-medium' variant='ghost'>Manage</Button>
        </Link>
      </div>
      <Container showMenu={showMenu}>
        {isLoading &&
          Array.from({ length: 8 }).fill(1).map((_, i) => (
            <VideoCard key={i} loading={isLoading} />
          ))
        }
        {videos?.data.docs.map((video) => (
          <VideoCard key={video._id} videoData={video} loading={isLoading} />
        ))}
      </Container>
    </div>
  )
}

export default SubscriptionVideos
