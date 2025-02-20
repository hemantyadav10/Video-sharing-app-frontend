import { Skeleton, Text } from '@radix-ui/themes'
import React from 'react'

function ChannelStatsCard({
  statType = '',
  statNumbers = 0,
  Icon,
  loading
}) {
  return (
    <div className='border border-[--gray-a6] rounded-lg p-4 flex flex-col gap-2  sm:col-span-1 hover:shadow-md  items-center hover:border-[--focus-8] transition-all'>
      <div className='flex items-center justify-center p-2  rounded-full w-max bg-[rgba(0,119,255,0.1)]'>
        <div className='p-[6px]  rounded-full bg-[#0077ff3a]'>
          <Icon size={20} strokeWidth={1.5} className='text-[--blue-12]' />
        </div>
      </div>
      <Text
        size={'1'}
      >
        {statType}
      </Text>
      <Skeleton loading={loading} width={'80px'}>
        <Text as='span' size={'7'}>
          {statNumbers}
        </Text>
      </Skeleton>
    </div>
  )
}

export default ChannelStatsCard
