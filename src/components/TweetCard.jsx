import { BookmarkIcon, DotsVerticalIcon, HeartFilledIcon, HeartIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, IconButton, Text } from '@radix-ui/themes'
import React from 'react'
import { timeAgo } from '../utils/formatTimeAgo'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useDeleteTweet } from '../lib/queries/tweetQueries'
import { useAuth } from '../context/authContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function TweetCard({
  tweetData,
  loading,
}) {
  const { user, isAuthenticated } = useAuth();
  const { mutate: deleteComment } = useDeleteTweet(user, tweetData?._id)
  const navigate = useNavigate()
  const handleDeleteTweet = async () => {
    deleteComment(tweetData?._id, {
      onSuccess: () => {
        toast('Tweet deleted')
      }
    })
  }

  const handleToggleLike = async () => {
    if(!isAuthenticated) {
      return navigate('/login')
    }
  }

  return (
    <div className='flex gap-3 pb-4 border border-[#484848] p-4 rounded-xl  '>
      <Avatar
        radius='full'
        src={tweetData?.owner.avatar}
        fallback="A"
      />
      <div className='flex flex-col w-full gap-2'>
        <div className='flex items-center justify-between '>
          <div>
            <Text
              as='span'
              size={'2'}
              mr={'3'}
            >
              @{tweetData?.owner.username}
            </Text>
            <Text
              as='span'
              size={'1'}
              color='gray'
            >
              {timeAgo(tweetData?.createdAt)}
            </Text>
          </div>
          {tweetData?.owner._id === user?._id && <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                variant='ghost'
                highContrast
                color='gray'
                radius='full'
                size={'2'}
              >
                <DotsVerticalIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant='soft'>
              <DropdownMenu.Item>
                <Pencil1Icon /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={handleDeleteTweet}>
                <TrashIcon /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          }
        </div>

        <Text
          as='p'
          className='pr-4 break-words whitespace-pre-wrap'
        >
          {tweetData?.content}
        </Text>
        <div className='flex items-center gap-1 mt-2 text-xs '>
          <IconButton
            onClick={handleToggleLike}
            variant='ghost'
            color='gray'
            highContrast
            radius='full'
          >
            {false ?
              <ThumbsUpSolidIcon height='20' width='20' /> :
              <ThumbsUp height='20' width='20' />
            }
          </IconButton>
          <Text as='span' color='gray' size={'1'}>
            {tweetData?.likesCount}
          </Text>
        </div>
      </div>

    </div>
  )
}

export default TweetCard
