import React from 'react'
import VideoIcon from '../assets/VideoIcon'
import { Text } from '@radix-ui/themes'

function NoContent({
  Icon = VideoIcon,
  title = 'No videos',
  description = 'There are no videos in this playlist yet',
  bgColor = 'bg-[rgba(0,119,255,0.1)]',
  iconBgColor = 'bg-[#0077ff3a]',
  iconSize = '28px',
  iconFill = '#c2e6ff'
}) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 mt-6 text-sm'>
      <div className={`flex items-center justify-center p-3 rounded-full w-max ${bgColor}`}>
        <div className={`p-2 rounded-full flex justify-center items-center ${iconBgColor}`}>
          <Icon
            width={iconSize}
            height={iconSize}
            className='text-[#c2e6ff]'
            fill={iconFill}
          />
        </div>
      </div>
      <Text size={'5'} weight={'medium'}>
        {title}
      </Text>
      <Text>
        {description}
      </Text>
    </div>
  )
}

export default NoContent
