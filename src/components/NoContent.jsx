import React from 'react'
import { Text } from '@radix-ui/themes'
import NoResult from '../assets/noResult.svg'

function NoContent({
  title = 'No videos',
  description = 'There are no videos in this playlist yet',
}) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 mt-6 text-sm'>
      <img
        src={NoResult}
        className='size-64'
        alt="no content image"
      />
      <Text size={'6'} weight={'medium'}>
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

export default NoContent
