import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useFetchVideoById } from '../lib/queries/videoQueries'
import { Button, DropdownMenu, IconButton, Skeleton } from '@radix-ui/themes'
import { BookmarkIcon, DotsVerticalIcon, HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { timeAgo } from '../utils/formatTimeAgo'
import CommentSection from '../components/CommentSection'

function VideoPage() {
  const { videoId } = useParams()
  const { data: video, isLoading } = useFetchVideoById(videoId)
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsOverflowing(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
    }
  }, [video?.data.description]);

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
              <Skeleton loading={isLoading}>
                <Button
                  radius='full'
                  color='blue'
                  highContrast
                >
                  Subscribe
                </Button>
              </Skeleton>
            </div>
            <div className='flex items-center gap-3 rounded-full'>
              <Skeleton loading={isLoading}>
                <Button
                  variant='soft'
                  color='gray'
                  highContrast
                  radius='full'
                >
                  <HeartIcon /> {video?.data.likesCount}
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
