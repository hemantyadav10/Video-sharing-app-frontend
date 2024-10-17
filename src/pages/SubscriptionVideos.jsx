import React from 'react'
import VideoCard from '../components/VideoCard'
import { Link, useOutletContext } from 'react-router-dom'
import Container from '../components/Container'
import { Button } from '@radix-ui/themes'

function SubscriptionVideos() {
  const [showMenu] = useOutletContext()

  return (
    <div className='w-full py-6'>
      <div className='flex items-center justify-between px-4 md:px-6 lg:px-10'>
        <span className='text-xl font-semibold'>Latest</span>
        <Link to={'/subscriptions/channels'}>
          <Button size={'2'} radius='full' className='font-medium' variant='ghost'>Manage</Button>
        </Link>
      </div>
      <Container showMenu={showMenu}>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <VideoCard key={i} />
        ))}
      </Container>
    </div>
  )
}

export default SubscriptionVideos
