import { Button, Spinner, TextArea } from '@radix-ui/themes'
import { SquarePen } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useOutletContext } from 'react-router-dom'
import EmptyLibrary from '../../components/EmptyLibrary'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import TweetCard from '../../components/TweetCard'
import { useAuth } from '../../context/authContext'
import { useCreateTweet, useFetchUserTweets } from '../../lib/queries/tweetQueries'

function ChannelTweets() {
  const { userId } = useOutletContext()
  const { user, isAuthenticated } = useAuth()
  const { data: userTweets, isLoading, isError, error, refetch } = useFetchUserTweets(userId, user?._id)
  const { mutate: createTweet, isPending: creatingTweet } = useCreateTweet(user, userId)
  const [content, setContent] = useState('')
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
  };

  const handleCreateTweet = async () => {
    createTweet(content, {
      onSuccess: () => {
        setContent('')
        toast('Tweet posted')
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  if (isLoading) return <div className=''><Spinner className='h-6 mx-auto' /></div>

  return (
    <div>
      {/* Text area to write a tweet */}
      {(isAuthenticated && user?._id === userId) &&
        <div className='flex-1 max-w-4xl px-4 mx-auto mb-6'>
          <TextArea
            ref={textareaRef}
            size={'3'}
            placeholder='Add a tweet...'
            value={content}
            onChange={e => setContent(e.target.value)}
            onInput={handleInput}
            disabled={creatingTweet}
            autoFocus
            className='peer'
          />
          <div className='flex justify-end gap-2 mt-2 '>
            <Button
              onClick={() => {
                setContent('')
                const textarea = textareaRef.current;
                textarea.style.height = "auto"; // Set height based on scroll height

              }}
              hidden={!content?.trim()}
              variant='surface'
              color='gray'
              highContrast
              className='px-4'
              radius='full'
              disabled={creatingTweet}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTweet}
              disabled={!content?.trim() || creatingTweet}
              loading={creatingTweet}
              highContrast
              className='px-4'
              radius='full'
            >
              Send
            </Button>
          </div>
        </div>
      }

      {/* tweet cards */}
      <div className='flex flex-col w-full max-w-4xl mx-auto sm:gap-6 sm:p-4 '>

        {isError && (
          <div className='border border-[#484848] rounded-xl p-6 pt-0'>
            <QueryErrorHandler error={error} onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && userTweets?.data.map((tweet) => (
          <TweetCard
            key={tweet._id}
            loading={isLoading}
            tweetData={tweet}
            channelId={userId}
          />
        ))}
        {!isLoading && !isError && userTweets?.data.length === 0 &&
          <EmptyLibrary
            Icon={SquarePen}
            title='Publish Tweet'
            description='Tweets appear here after you publish'
          />
        }
      </div>
    </div>
  )
}

export default ChannelTweets
