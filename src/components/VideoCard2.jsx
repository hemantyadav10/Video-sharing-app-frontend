import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton, Skeleton, Spinner, Text } from '@radix-ui/themes'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { useToggleVideoLike } from '../lib/queries/likeQueries'
import { useRemoveVideoFromPlaylist } from '../lib/queries/playlistQueries'
import { timeAgo } from '../utils/formatTimeAgo'
import { formatVideoDuration } from '../utils/formatVideoDuration'

function VideoCard2({
  videoNumber = 0,
  video,
  playlistOwnerId,
  playlistName,
  removeType,
  removeContent = 'Remove from playlist',
  playlistId,
  loading = true
}) {
  const { user } = useAuth()
  const { mutate: unlikeVideo } = useToggleVideoLike(video?._id, user?._id)
  const {
    mutate: removeVideoFromPlaylist,
    isPending: removingVideo,
  } = useRemoveVideoFromPlaylist(video, user?._id)
  const [open, setOpen] = useState(false)


  const handleRemoveVideo = async (e) => {
    if (removeType === 'playlist') {
      e.preventDefault()
    }
    e.stopPropagation()
    if (removingVideo) return;

    if (removeType === 'like') {
      unlikeVideo(video, {
        onSuccess: () => {
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);
        }
      }
      )
    } else if (removeType === 'playlist') {
      removeVideoFromPlaylist({ playlistId, videoId: video._id }, {
        onSuccess: () => {
          setOpen(false)
          return toast.success(`Removed from ${playlistName}`)
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);
        }
      })
    }
  }

  return (
    <Link
      tabIndex={loading ? -1 : 0}
      aria-disabled={loading}
      to={`/watch/${video?._id}`}
      className={`flex flex-col w-full gap-2 p-4 pr-2  rounded-2xl sm:flex-row sm:items-start sm:py-2 ${loading ? 'cursor-default pointer-events-none' : "hover:bg-[--gray-a3] active:bg-[--gray-a4]"} `}
    >
      <Skeleton loading={loading} className='my-auto h-max'>
        <div className='hidden my-auto text-sm transition-all sm:block'>
          {videoNumber}
        </div>
      </Skeleton>
      <Skeleton loading={loading}>
        <div className='relative w-full aspect-video rounded-xl sm:max-w-48 sm:flex-1'>
          <img src={video?.thumbnail} alt="" className='object-cover object-center w-full h-full rounded-xl' />
          <Text
            className='absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 text-white font-medium rounded-md'
            as='span'
          >
            {formatVideoDuration(video?.duration)}
          </Text>
        </div>
      </Skeleton>
      <div className='flex flex-1 gap-1'>
        <div className='flex-1 '>
          <Skeleton loading={loading} className='w-5/6 h-5'>
            <Text
              size={'2'}
              as='div'
              title={video?.title}
              mb={'2'}
              weight={'medium'}
              className='text-base font-medium line-clamp-2 lg:text-sm xl:text-base'>
              {video?.title}
            </Text>
          </Skeleton>
          <Skeleton loading={loading}>
            <Text as='span' color='gray' className='text-xs'>
              {video?.owner.username} • {video?.views} views • {timeAgo(video?.createdAt)}
            </Text>
          </Skeleton>
        </div>
        {user?._id === playlistOwnerId && <div className='flex items-center justify-center'>
          <DropdownMenu.Root
            open={open}
            onOpenChange={(o) => {
              setOpen(o)
            }}
          >
            <DropdownMenu.Trigger>
              <IconButton
                mx={'1'}
                variant='ghost'
                size={'3'}
                aria-label="More options"
                color='gray'
                radius='full'
                highContrast
              >
                <DotsVerticalIcon width="18" height="18" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant='soft'>
              <DropdownMenu.Item
                disabled={removingVideo}
                onClick={(e) => handleRemoveVideo(e)}>
                <Spinner loading={removingVideo}>
                  <TrashIcon />
                </Spinner>
                {removeContent}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>}
      </div>
    </Link>
  )
}

export default VideoCard2
