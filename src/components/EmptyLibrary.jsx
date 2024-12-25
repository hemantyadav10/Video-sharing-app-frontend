import { VideoIcon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import React from 'react'

function EmptyLibrary({
  Icon = VideoIcon,
  title = 'No videos',
  description = 'There are no videos in this playlist yet',
  bgColor = 'bg-[#d3edf812]',
  iconBgColor = 'bg-[#d3edf812]',
  iconSize = '28px',
  iconFill = '#edeef0'
}) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 text-sm '>
      <div className={`flex items-center justify-center p-3 rounded-full w-max ${bgColor}`}>
        <div className={`p-2 rounded-full flex justify-center items-center ${iconBgColor}`}>
          <Icon
            width={iconSize}
            height={iconSize}
            className='text-[#edeef0]'
            fill={iconFill}
          />
        </div>
      </div>
      <Text size={'5'} weight={'medium'}
      >
        {title}
      </Text>
      <Text
        align={'center'}
        className='max-w-sm'
        color='gray'
      >
        {description}
      </Text>
    </div>
  )
}

export default EmptyLibrary
