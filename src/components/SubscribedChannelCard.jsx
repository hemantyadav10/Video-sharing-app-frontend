import { Skeleton, Text } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'
import SubscriptionButton from './SubscriptionButton'

function SubscribedChannelCard({
  channel,
  loading,
}) {

  console.log(channel)
  return (
    <div className='flex items-center justify-between w-full max-w-3xl gap-4 mx-auto '>
      <Link to={`/channel/${channel?._id}`} className='flex items-center flex-1 gap-4 group' >
        <Skeleton loading={loading}>
          <div className='w-16 transition-all rounded-full sm:w-20 md:w-28 group-hover:brightness-75 group-active:brightness-100 aspect-square'>
            <img src={channel?.avatar} alt="" className='object-cover object-center w-full h-full rounded-full' />
          </div>
        </Skeleton>
        <div className='flex-1 space-y-2'>
          <p className='text-lg font-medium break-words line-clamp-2'>
            <Skeleton height={'20px'} className='w-1/2' loading={loading}>
              {channel?.fullName}
            </Skeleton>
          </p>
          <Skeleton loading={loading} className='w-40'>
            <Text as='p' size={'1'} color='gray'>
              @{channel?.username} • {channel?.subscribersCount} subscribers
            </Text>
          </Skeleton>
        </div>
      </Link>
      <div className='hidden sm:block'>
        <Skeleton loading={loading}>
          <SubscriptionButton
            userId={channel?._id}
            subscribed={true}
            loading={loading}
          />
        </Skeleton>

      </div>
    </div>
  )
}

export default SubscribedChannelCard
