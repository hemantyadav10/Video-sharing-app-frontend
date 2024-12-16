import { Cross1Icon } from '@radix-ui/react-icons'
import { Avatar, Flex, IconButton, Skeleton, Text, Tooltip } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'
import { timeAgo } from '../utils/formatTimeAgo'
import { formatVideoDuration } from '../utils/formatVideoDuration'
import { useAuth } from '../context/authContext'
import SaveToPlaylistButton from './SaveToPlaylistButton'

function VideoCard({
  hideAvatar = false,
  list = false,
  moreOptionsButton = true,
  removeFromHistoryButton = false,
  videoData,
  loading,
  hideUsername = false,
}) {
  const { isAuthenticated } = useAuth()

  return (
    <div className={`flex gap-4 mb-4 sm:rounded-xl ${list ? 'sm:grid sm:grid-cols-12 w-full flex-col max-w-6xl ' : 'flex-col '}  line-clamp-1 sm:p-1`}>
      <Skeleton loading={loading}>
        <Link
          to={`/watch/${videoData?._id}`}
          state={{ thumbnail: videoData?.thumbnail }}
          className={`relative sm:rounded-xl aspect-video  ${list ? "sm:col-span-5" : ""} overflow-hidden`}
        >
          <img
            src={videoData?.thumbnail || 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop'}
            alt={videoData?.title || "Video thumbnail"}
            className={`object-cover object-center w-full sm:rounded-xl aspect-video hover:scale-105 transition-transform duration-300`}
          />
          <Text
            className='absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md'
            as='span'
          >
            {formatVideoDuration(videoData?.duration)}
          </Text>
        </Link>
      </Skeleton>
      <Flex
        className={`relative ${list ? "sm:col-span-7" : ""} p-1 sm:p-0`}
      >
        {removeFromHistoryButton && !loading &&
          <Tooltip
            width={'100px'}
            content='Remove from watch history'
          >
            <IconButton
              aria-label="Remove from watch history"
              variant='ghost'
              className='absolute rounded-full sm:right-[6px] top-2 right-2'
              highContrast
              color='gray'
            >
              <Cross1Icon height={'20'} width={'20'} />
            </IconButton>
          </Tooltip>
        }
        {/* hidden={loading || !isAuthenticated} */}

        {!hideAvatar &&
          <Skeleton loading={loading}>
            <Link to={`/channel/${videoData?.owner?._id}`} className={`w-10 h-10 transition-all rounded-full aspect-square hover:brightness-90 ${list && " sm:hidden"} mr-3 `}>
              <Avatar
                radius='full'
                size={'3'}
                src={videoData?.owner?.avatar}
                fallback="A"
                className={` w-full h-full object-cover object-center`}
              />
            </Link>
          </Skeleton>
        }
        <Flex
          direction={'column'}
          gapY={'2'}
          className='flex-1'
        >
          <Skeleton loading={loading} height={'20px'} className='w-[90%]' >
            <Link
              title={videoData?.title}
              to={`/watch/${videoData?._id}`}
              className={`text-sm line-clamp-2 ${list ? "md:text-base lg:text-lg" : ""} font-medium`}
            >
              {videoData?.title}
            </Link>
          </Skeleton>
          {!hideUsername &&
            <Link to={`/channel/${videoData?.owner?._id}`}
              className=''
            >
              <Text
                as='p'
                size={'1'}
                color='gray'
                className={`${list && "sm:order-2 flex items-center gap-3"} hover:text-white`}
              >
                {list &&
                  <Skeleton loading={loading}>
                    <Avatar
                      radius='full'
                      src={videoData?.owner?.avatar}
                      fallback="A"
                      className={`  object-cover object-center hidden  size-6 sm:block`}
                    />
                  </Skeleton>
                }
                <Skeleton loading={loading} className='w-1/4 h-4'>
                  <Text as='span' size={'1'}>
                    {videoData?.owner?.fullName}
                  </Text>
                </Skeleton>
              </Text>
            </Link>
          }
          <Flex gap={'1'} align={'center'} className={`${list && "sm:order-1"}`}>
            <Skeleton loading={loading} >
              <Text as='span' color='gray' size={'1'} >{videoData?.views} views</Text>
              <Text as='span' color='gray' size={'1'} >•</Text>
              <Text as='span' color='gray' size={'1'} >
                {timeAgo(videoData?.createdAt)}</Text>
            </Skeleton>
          </Flex>
          {list && <div className={`${list && "hidden sm:block sm:order-3"}`}>
            <Skeleton loading={loading} className='w-3/4 h-4'>
              <Text
                as='p'
                size={'1'}
                color='gray'
                className='line-clamp-1'
              >
                {videoData?.description}
              </Text>
            </Skeleton>
          </div>}
        </Flex>
        {
          moreOptionsButton && !loading &&
          <div>
            < SaveToPlaylistButton videoData={videoData} />
          </div>
        }
      </Flex>
    </div >
  )
}

export default VideoCard
