import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, IconButton, Skeleton, Spinner, Text, TextArea } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import { timeAgo } from '../utils/formatTimeAgo'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useDeleteTweet, useUpdateTweet } from '../lib/queries/tweetQueries'
import { useAuth } from '../context/authContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useToggleTweetLike } from '../lib/queries/likeQueries'
import { useReadMore } from '../hooks/useReadMore'

function TweetCard({
  tweetData,
  channelId
}) {
  const { user, isAuthenticated } = useAuth();
  const { mutateAsync: deleteComment, isPending: deletingComment } = useDeleteTweet(tweetData?._id, channelId)
  const navigate = useNavigate()
  const { mutate: toggleLike, isPending: likeTweetLoading } = useToggleTweetLike(tweetData?._id, channelId, user?._id)
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(tweetData?.content)
  const { mutate: updateTweet, isPending: updatingTweet } = useUpdateTweet(tweetData?._id, channelId)
  const textareaRef = useRef(null);
  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
    setIsExpanded,
    setIsLongContent
  } = useReadMore(content)

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
  };

  const handleDeleteTweet = async () => {
    toast.promise(
      deleteComment(tweetData?._id),
      {
        loading: 'Deleting tweet...',
        success: 'Tweet deleted',
        error: (error) => error?.response?.data?.message || 'Something went wrong, please try again.',
      })
  }

  const handleToggleLike = async () => {
    if (isAuthenticated) {
      toggleLike(tweetData?._id, {
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);
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
        setIsExpanded(true)
        setIsLongContent(false)
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      handleInput(); // Adjust height when entering edit mode
    }
  }, [isEditable]);

  return (
    <div className='flex gap-3 pb-4 border border-[#484848] p-4 rounded-xl hover:shadow-lg hover:shadow-black/30 transition-shadow'>
      <Avatar
        radius='full'
        src={tweetData?.owner.avatar}
        fallback="A"
      />
      {isEditable && <div className='flex-1'>
        <TextArea
          autoFocus
          size={'3'}
          ref={textareaRef}
          onInput={handleInput}
          placeholder='Add a tweet...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={updatingTweet}
        />
        <div className='flex justify-end gap-2 mt-2 '>
          <Button
            onClick={() => {
              setIsEditable(false)
              setContent(tweetData?.content)
            }}
            variant='surface'
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
            disabled={!content?.trim() || content?.trim() === tweetData?.content || updatingTweet}
            loading={updatingTweet}
            highContrast
            className='px-4'
            radius='full'
          >
            Save
          </Button>
        </div>
      </div>}
      <div className={`flex flex-col w-full gap-2 ${isEditable ? "hidden" : ""} `}>
        <div className='flex items-center justify-between '>
          <div>
            <Text
              as='span'
              size={'2'}
              mr={'3'}
            >
              {tweetData?.owner.fullName}
            </Text>
            <Text
              as='span'
              size={'1'}
              color='gray'
            >
              {timeAgo(tweetData?.createdAt)}
            </Text>
            <Text
              as='span'
              size={'1'}
              color='gray'
            >
              {" "}{tweetData?.createdAt !== tweetData?.updatedAt && "(edited)"}
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
                  title='More options'
                  aria-label='More options'
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
          ref={contentRef}
          as='p'
          className={`pr-4 break-words whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}
        >
          {tweetData?.content}
        </Text>
        {!updatingTweet && isLongContent && <div>
          <Button
            variant='ghost'
            color='gray'
            radius='full'
            onClick={() => {
              toggleExpand()
            }}
            className='py-0 font-medium transition bg-transparent hover:text-white'
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        </div>}
        <div className='flex items-center gap-1 mt-2 text-xs '>
          <IconButton
            aria-label={tweetData?.isLiked ? 'Unlike tweet' : 'Like tweet'}
            title={tweetData?.isLiked ? 'Unlike tweet' : 'Like tweet'}
            onClick={handleToggleLike}
            variant='ghost'
            color='gray'
            highContrast
            radius='full'
            disabled={deletingComment || likeTweetLoading}
          >
            {(tweetData?.isLiked) ?
              <ThumbsUpSolidIcon height='20' width='20' /> :
              <ThumbsUp height='20' width='20' />
            }
          </IconButton>
          <Text as='span' color='gray' size={'1'}>
            {tweetData?.likesCount || 0}
          </Text>
        </div>
      </div>
    </div >
  )
}

export default React.memo(TweetCard)
