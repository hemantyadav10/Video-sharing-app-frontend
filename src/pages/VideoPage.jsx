import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetchVideoById } from '../lib/queries/videoQueries'
import { Button, DropdownMenu, Flex, IconButton, Popover, Skeleton, Text } from '@radix-ui/themes'
import { BookmarkIcon, DotsVerticalIcon, HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { timeAgo } from '../utils/formatTimeAgo'
import CommentSection from '../components/CommentSection'
import SubscriptionButton from '../components/SubscriptionButton'
import { useAuth } from '../context/authContext'
import ThumbsUp from '../assets/ThumbsUpIcon'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import { useToggleVideoLike } from '../lib/queries/likeQueries'
import toast from 'react-hot-toast'

function VideoPage() {
  const { videoId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const { data: video, isLoading } = useFetchVideoById(videoId, user?._id)
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  console.log(video)
  const { mutate: toggleLike } = useToggleVideoLike(videoId)
  const [isVideoLiked, setIsVideoLiked] = useState(video?.data.isLiked || false)
  const [videoLikesCount, setVideoLikesCount] = useState(video?.data.likesCount || 0)

  console.log(videoLikesCount)

  useEffect(() => {
    if (descriptionRef.current) {
      setIsOverflowing(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
    }
  }, [video?.data.description]);

  useEffect(() => {
    if (video?.data.isLiked !== undefined) {
      setIsVideoLiked(video?.data.isLiked);
    }
  }, [video?.data.isLiked]);

  useEffect(() => {
    setVideoLikesCount(video?.data.likesCount);
  }, [video?.data.likesCount]);



  const handleToggleLike = async () => {
    if (isAuthenticated) {

      setIsVideoLiked(prev => !prev)
      setVideoLikesCount(prev => {
        return isVideoLiked ? prev - 1 : prev + 1
      })
      toggleLike(videoId, {
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsVideoLiked((prev) => !prev);
          setVideoLikesCount((prev) => !prev);
          toast.error('Something went wrong. Please try again.');
        }
      })
    }
  }

  return (
    <div className='w-full mb-32 sm:p-6'>
      <div className='max-w-4xl'>
        <Skeleton loading={isLoading}>
          <div className='w-full sm:rounded-xl aspect-video'>
            <video controls className='object-cover object-center w-full aspect-video sm:rounded-xl focus:outline-none'>
              <source src={video?.data.videoFile} />
            </video>
          </div>
        </Skeleton>
        <div className='w-full p-3 space-y-3 '>
          <Skeleton loading={isLoading} height={'28px'} className='w-3/4'>
            <p className='font-medium sm:text-lg'>
              {video?.data.title}
            </p>
          </Skeleton>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-between'>
            <div className='flex items-center justify-between gap-6'>
              <div
                to={`/channel/${video?.data.owner._id}`}
                className='flex items-center gap-3'
              >
                <Skeleton
                  loading={isLoading}
                  className='rounded-full'>
                  <Link
                    to={`/channel/${video?.data.owner._id}`}
                  >
                    <img
                      src={video?.data.owner.avatar}
                      alt=""
                      className='object-cover object-center rounded-full size-10'
                    />
                  </Link>
                </Skeleton>
                <Skeleton loading={isLoading}>
                  <Link
                    to={`/channel/${video?.data.owner._id}`}
                    className='text-sm'>
                    <p className='font-medium sm:text-base'>{video?.data.owner.username}</p>
                    <p className='text-xs text-[#f1f7feb5]'>{video?.data.owner.subscribersCount} subscribers</p>
                  </Link>
                </Skeleton>
              </div>
              {isAuthenticated ?
                (user?._id === video?.data.owner._id ?
                  <Button
                    radius='full'
                    variant='soft'
                    highContrast
                  >
                    Edit video
                  </Button> :
                  <SubscriptionButton
                    loading={isLoading}
                    userId={video?.data.owner._id}
                    subscribed={video?.data.owner.isSubscribed}
                  />
                ) :
                <Popover.Root >
                  <Skeleton loading={isLoading}>
                    <Popover.Trigger>
                      <Button
                        color='blur'
                        highContrast
                        radius='full'
                      >
                        Subscribe
                      </Button>
                    </Popover.Trigger>
                  </Skeleton>
                  <Popover.Content className='z-10' width="360px">
                    <Flex p={'2'} direction={'column'} gapY={'3'}>
                      <Text as='p'>
                        Want to subscribe to this channel?
                      </Text>
                      <Text size={'2'} color='gray'>
                        Sign in to subscribe to this channel.
                      </Text>
                      <Link to={'/login'}>
                        <Button mt={'4'} radius='full' variant='ghost' className='w-max'>
                          Sign in
                        </Button>
                      </Link>
                    </Flex>
                  </Popover.Content>
                </Popover.Root>
              }

            </div>
            <div className='flex items-center gap-3 rounded-full'>
              <Skeleton loading={isLoading}>
                <Button
                  onClick={handleToggleLike}
                  variant='soft'
                  color='gray'
                  highContrast
                  radius='full'
                >
                  {isVideoLiked ? <ThumbsUpSolidIcon height='20' width='20' /> : <ThumbsUp height='20' width='20' />} {videoLikesCount}
                </Button>
              </Skeleton>

              <DropdownMenu.Root >
                <Skeleton loading={isLoading}>
                  <DropdownMenu.Trigger >
                    <IconButton
                      aria-label="More options"
                      variant='soft'
                      radius='full'
                      highContrast
                      color='gray'
                    >
                      <DotsVerticalIcon width="18" height="18" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                </Skeleton>
                <DropdownMenu.Content variant='soft'>
                  <DropdownMenu.Item>
                    <BookmarkIcon /> Save to Playlist
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
          <Skeleton loading={isLoading}>
            <div className='p-3 text-sm  rounded-xl bg-[#ddeaf814] space-y-1 min-h-12'>
              <div className='flex gap-2 font-medium'>
                <p>
                  {video?.data.views} views
                </p>
                {timeAgo(video?.data.createdAt)}
              </div>
              <p
                ref={descriptionRef}
                className={`  ${isExpanded ? "h-auto" : "line-clamp-2"} duration-300`}
              >
                {video?.data.description}
              </p>
              {isOverflowing &&
                <Button
                  variant='ghost'
                  color='blue'
                  className='font-medium'
                  radius='full'
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </Button>
              }
            </div>
          </Skeleton>
        </div>

      </div >
      <div hidden={isLoading}>
        <CommentSection hidden videoId={videoId} />
      </div>
    </div >
  )
}

export default VideoPage
