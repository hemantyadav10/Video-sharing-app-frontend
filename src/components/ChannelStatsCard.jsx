import { Skeleton, Text } from '@radix-ui/themes'
import React from 'react'

function ChannelStatsCard({
  statType = '',
  statNumbers = 0,
  Icon,
  loading
}) {
  return (
    <div className='border border-[#484848] rounded-xl p-4 flex flex-col gap-2  sm:col-span-1 hover:shadow-lg hover:shadow-black/50 items-center'>
      <div className='flex items-center justify-center p-2  rounded-full w-max bg-[rgba(0,119,255,0.1)]'>
        <div className='p-[6px]  rounded-full bg-[#0077ff3a]'>
          <Icon width='20px' height='20px' className='text-[#c2e6ff]' fill='#c2e6ff' />
        </div>
      </div>
      <Text
        size={'1'}
        color='gray'
      >
        {statType}
      </Text>
      <Skeleton loading={loading} width={'50px'}>
        <Text as='span' size={'7'}>
          {statNumbers}
        </Text>
      </Skeleton>
    </div>
  )
}

export default ChannelStatsCard
