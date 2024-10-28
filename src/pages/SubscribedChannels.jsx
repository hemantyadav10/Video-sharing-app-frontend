import React from 'react'
import SubscribedChannelCard from '../components/SubscribedChannelCard'
import { useFetchSubcribedChannels } from '../lib/queries/subscriptionQueries'
import { useAuth } from '../context/authContext'

function SubscribedChannels() {
  const { user, isAuthenticated } = useAuth()
  const { data, isLoading } = useFetchSubcribedChannels(user?._id)
  console.log(data)
  return (
    <div className='w-full p-8 space-y-10'>
      <h1 className='max-w-3xl mx-auto text-3xl font-semibold '>All subscriptions</h1>
      <div className='flex flex-col gap-8 '>
        {isLoading &&
          Array.from({ length: 6 }).fill(1).map((_, i) => (
            <SubscribedChannelCard key={i} loading={isLoading} />
          ))
        }
        {data?.data.map((subscription, i) => (
          <SubscribedChannelCard
            key={i}
            channel={subscription.channel}
            loading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}

export default SubscribedChannels
