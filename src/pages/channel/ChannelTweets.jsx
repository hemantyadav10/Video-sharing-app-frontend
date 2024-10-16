import { Button, Flex, TextArea } from '@radix-ui/themes'
import React from 'react'
import TweetCard from '../../components/TweetCard'

function ChannelTweets() {
  return (
    <div className='xl:px-32 lg:px-10'>
      {/* Text area to write a tweet */}
      <TextArea placeholder="Add a tweet..." />
      <Flex justify={'end'} align={'center'} gapX={'2'} mt={'2'}>
        <Button variant='soft' color='gray' highContrast>
          Cancel
        </Button>
        <Button variant='surface' highContrast>
          Send
        </Button>
      </Flex>
      {/* tweet cards */}
      <div className='flex flex-col gap-6 mt-6'>
        {Array.from({ length: 10 }).fill(1).map((tweet, i) => (
          <>
            <TweetCard key={i} />
          </>
        ))}
      </div>
    </div>
  )
}

export default ChannelTweets
