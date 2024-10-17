import React from 'react'
import SubscribedChannelCard from '../components/SubscribedChannelCard'

function SubscribedChannels() {
  return (
    <div className='w-full p-8 space-y-10'>
      <h1 className='max-w-3xl mx-auto text-3xl font-semibold '>All subscriptions</h1>
      <div className='flex flex-col gap-8 '>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <SubscribedChannelCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default SubscribedChannels
