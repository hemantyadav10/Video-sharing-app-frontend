import React from 'react'
import SubscribedChannelCard from '../components/SubscribedChannelCard'
import { useFetchSubcribedChannels } from '../lib/queries/subscriptionQueries'
import { useAuth } from '../context/authContext'
import QueryErrorHandler from '../components/QueryErrorHandler'
import no_content from '../assets/no_content.svg'
import { Text } from '@radix-ui/themes'


function SubscribedChannels() {
  const { user, isAuthenticated } = useAuth()
  const { data, isFetching, isError, refetch, error } = useFetchSubcribedChannels(user?._id)
  console.log(data)
  return (
    <div className='w-full p-8 space-y-10'>
      <h1 className='max-w-3xl mx-auto text-3xl font-semibold '>All subscriptions</h1>
      <div className='flex flex-col gap-8 '>
        {isError && (
          <QueryErrorHandler error={error} onRetry={refetch} />
        )}
        {isFetching &&
          Array.from({ length: 6 }).fill(1).map((_, i) => (
            <SubscribedChannelCard key={i} loading={isFetching} />
          ))
        }
        {!isError && (data?.data.length > 0
          ? data?.data.map((subscription, i) => (
            <SubscribedChannelCard
              key={i}
              channel={subscription.channel}
              loading={isFetching}
            />
          ))
          :
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <img
              src={no_content}
              alt="No Subscriptions"
              className="w-48 h-48 mb-6"
            />
            <Text as='p' className='font-medium' size={'6'}>
              You're not subscribed to any channels yet!
            </Text>
            <Text as='p' mt={'2'} color='gray'>
              Explore amazing content and subscribe to your favorite channels.
            </Text>
            {/* <button
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => navigate('/explore')}
            >
              Discover Channels
            </button> */}
          </div>)
        }
      </div>
    </div>
  )
}

export default SubscribedChannels
