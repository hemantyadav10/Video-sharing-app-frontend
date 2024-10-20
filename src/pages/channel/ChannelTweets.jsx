import { Button, Flex, Spinner, TextArea } from '@radix-ui/themes'
import React from 'react'
import TweetCard from '../../components/TweetCard'
import { useFetchUserTweets } from '../../lib/queries/tweetQueries'
import { useOutletContext } from 'react-router-dom'

function ChannelTweets() {
  const { userId } = useOutletContext()
  const { data: userTweets, isLoading, error } = useFetchUserTweets(userId)

  if (isLoading) return <div className=''><Spinner className='h-6 mx-auto' /></div>

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
        {userTweets?.data.map((tweet) => (
          <>
            <TweetCard
              key={tweet._id}
              loading={isLoading}
              tweetData={tweet}
            />
          </>
        ))}
      </div>
    </div>
  )
}

export default ChannelTweets
