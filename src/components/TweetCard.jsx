import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, IconButton, Text, TextArea } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import { timeAgo } from '../utils/formatTimeAgo'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useDeleteTweet, useUpdateTweet } from '../lib/queries/tweetQueries'
import { useAuth } from '../context/authContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useToggleTweetLike } from '../lib/queries/likeQueries'

function TweetCard({
  tweetData,
  channelId
}) {
  const { user, isAuthenticated } = useAuth();
  const { mutateAsync: deleteComment, isPending: deletingComment } = useDeleteTweet(tweetData?._id, channelId)
  const navigate = useNavigate()
  const [tweetLikesCount, setTweetLikesCount] = useState(tweetData?.likesCount || 0)
  const [isTweetLiked, setIsTweetLiked] = useState(tweetData?.isLiked || false)
  const { mutate: toggleLike } = useToggleTweetLike(tweetData?._id, channelId)
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(tweetData?.content)
  const { mutate: updateTweet, isPending: updatingTweet } = useUpdateTweet(tweetData?._id, channelId)
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
  };

  useEffect(() => {
    if (tweetData?.isLiked !== undefined) {
      setIsTweetLiked(tweetData?.isLiked);
    }
  }, [tweetData?.isLiked]);

  const handleDeleteTweet = async () => {
    toast.promise(
      deleteComment(tweetData?._id),
      {
        loading: 'Deleting tweet...',
        success: 'Tweet deleted',
        error: 'Something went wrong, please try again.',
      }, {
      icon: false
    })
  }

  const handleToggleLike = async () => {
    if (isAuthenticated) {

      setIsTweetLiked(prev => !prev)
      setTweetLikesCount(prev => {
        return isTweetLiked ? prev - 1 : prev + 1
      })
      toggleLike(tweetData?._id, {
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsTweetLiked((prev) => !prev);
          setTweetLikesCount((prev) => !prev);
          toast.error('Something went wrong. Please try again.');
        }
      })
    } else {
      navigate('/login')
    }
  }

  const handleUpdateTweet = async () => {
    updateTweet(content, {
      onSuccess: () => {
        setIsEditable(false)
        toast('Tweet updated')
      }
    })
  }

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      handleInput(); // Adjust height when entering edit mode
    }
  }, [isEditable]);

  return (
    <div className='flex gap-3 pb-4 border border-[#484848] p-4 rounded-xl'>
      <Avatar
        radius='full'
        src={tweetData?.owner.avatar}
        fallback="A"
      />
      {isEditable && <div className='flex-1'>
        <TextArea
          ref={textareaRef}
          onInput={handleInput}
          placeholder='Add a tweet...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          disabled={updatingTweet}
        />
        <div className='flex justify-end gap-2 mt-2 '>
          <Button
            onClick={() => {
              setIsEditable(false)
              setContent(tweetData?.content)
            }}
            variant='soft'
            color='gray'
            className='px-4'
            radius='full'
            highContrast
            disabled={updatingTweet}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTweet}
            disabled={!content?.trim() || content?.trim() === tweetData?.content}
            loading={updatingTweet}
            highContrast
            className='px-4'
            radius='full'
          >
            Save
          </Button>
        </div>
      </div>}
      {!isEditable && <div className='flex flex-col w-full gap-2'>
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
          {tweetData?.owner._id === user?._id &&
            <DropdownMenu.Root>
              <DropdownMenu.Trigger disabled={deletingComment}>
                <IconButton
                  variant='ghost'
                  highContrast
                  color='gray'
                  radius='full'
                  size={'2'}
                >
                  <DotsVerticalIcon height={'18px'} width={'18px'} />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                variant='soft'
                highContrast
                className='w-48'
              >
                <DropdownMenu.Item onClick={() => setIsEditable(true)}>
                  <Pencil1Icon /> Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item color='red' onClick={handleDeleteTweet}>
                  <TrashIcon /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          }
        </div>

        <Text
          as='p'
          size={'2'}
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
            disabled={deletingComment}
          >
            {(isAuthenticated && isTweetLiked) ?
              <ThumbsUpSolidIcon height='20' width='20' /> :
              <ThumbsUp height='20' width='20' />
            }
          </IconButton>
          <Text as='span' color='gray' size={'1'}>
            {tweetLikesCount}
          </Text>
        </div>
      </div>}

    </div>
  )
}

export default React.memo(TweetCard)
