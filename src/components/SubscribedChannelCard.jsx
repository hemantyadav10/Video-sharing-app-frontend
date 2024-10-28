import { Button, Skeleton } from '@radix-ui/themes'
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
        <Skeleton className='w-32 min-w-16 aspect-square' loading={loading}>
          <div className='transition-all rounded-full max-w-32 min-w-16 group-hover:brightness-75 group-active:brightness-100'>
            <img src={channel?.avatar} alt="" className='object-cover object-center w-full rounded-full aspect-square' />
          </div>
        </Skeleton>
        <div className='flex-1 space-y-2'>
          <p className='text-lg font-medium break-words line-clamp-2'>
            <Skeleton height={'28px'} className='w-1/2' loading={loading}>
              {channel?.fullName}
            </Skeleton>
          </p>
          <Skeleton loading={loading}>
            <span className='text-xs text-[#f1f7feb5]'>@{channel?.username} • {channel?.subscribersCount} subscribers</span>
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
