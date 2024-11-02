import { Button, Flex, Spinner, TextArea } from '@radix-ui/themes'
import React, { useMemo, useState } from 'react'
import TweetCard from '../../components/TweetCard'
import { useCreateTweet, useFetchUserTweets } from '../../lib/queries/tweetQueries'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { set } from 'react-hook-form'
import toast from 'react-hot-toast'

function ChannelTweets() {
  const { userId } = useOutletContext()
  const { user, isAuthenticated } = useAuth()
  const { data: userTweets, isLoading, error } = useFetchUserTweets(userId)
  const { mutate: createTweet, isPending: creatingTweet } = useCreateTweet(user)
  const [content, setContent] = useState('')

  const handleCreateTweet = async () => {
    createTweet(content, {
      onSuccess: () => {
        setContent('')
        toast('Tweet posted')
      }
    })
  }

  if (isLoading) return <div className=''><Spinner className='h-6 mx-auto' /></div>

  return (
    <div>
      {/* Text area to write a tweet */}
      {user?._id === userId && <div className='flex-1 max-w-4xl'>
        <TextArea
          placeholder='Add a tweet...'
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className='flex justify-end gap-2 mt-2 '>
          <Button
            onClick={() => {
              setContent('')
            }}
            hidden={!content?.trim()}
            variant='soft'
            color='gray'
            highContrast
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTweet}
            disabled={!content?.trim()}
            loading={creatingTweet}
            variant='soft'
            highContrast
          >
            Send
          </Button>
        </div>
      </div>
      }
      {/* tweet cards */}
      <div className='flex flex-col max-w-4xl gap-6 mt-6'>
        {userTweets?.data.map((tweet) => (
          <TweetCard
            key={tweet._id}
            loading={isLoading}
            tweetData={tweet}
          />
        ))}
      </div>
    </div>
  )
}

export default ChannelTweets
