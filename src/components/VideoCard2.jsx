import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton, Skeleton, Text } from '@radix-ui/themes'
import { Link, useNavigate } from 'react-router-dom'
import { timeAgo } from '../utils/formatTimeAgo'
import { useToggleVideoLike } from '../lib/queries/likeQueries'
import { queryClient } from '../main'
import { useAuth } from '../context/authContext'
import { useRemoveVideoFromPlaylist } from '../lib/queries/playlistQueries'
import toast from 'react-hot-toast'
import { formatVideoDuration } from '../utils/formatVideoDuration'

function VideoCard2({
  videoNumber = 0,
  video,
  playlistOwnerId,
  removeType,
  removeContent = 'Remove from playlist',
  playlistId,
  loading = true
}) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutate: unlikeVideo } = useToggleVideoLike(video?._id)
  const { mutate: removeVideoFromPlaylist } = useRemoveVideoFromPlaylist(video, user?._id)


  const handleRemoveVideo = async (e) => {
    e.stopPropagation();

    if (removeType === 'like') {
      unlikeVideo(video?._id, {
        onSuccess: () => {
          queryClient.setQueryData(['liked_videos', user?._id], (prev) => {
            return {
              ...prev,
              data: prev.data.filter((item) => item.video._id !== video?._id)
            }
          })
        }
      })
    } else if (removeType === 'playlist') {
      removeVideoFromPlaylist({ playlistId, videoId: video._id }, {
        onSuccess: () => {
          toast(`Removed from ${playlistName}`)
          console.log(`Removed from ${playlistName}`)
        }
      })
    }

  }
  console.log(loading)

  return (
    <Link
      tabIndex={loading ? -1 : 0}
      aria-disabled={loading}
      to={`/watch/${video?._id}`}
      className={`flex flex-col w-full gap-2 p-4  rounded-2xl sm:flex-row sm:py-2 ${loading ? 'cursor-default pointer-events-none' : "hover:bg-[#ddeaf814] active:bg-[#ddeaf81a]"} `}
    >
      <Skeleton loading={loading} className='my-auto h-max'>
        <div className='items-center justify-center hidden text-sm transition-all sm:flex'>
          {videoNumber}
        </div>
      </Skeleton>
      <Skeleton loading={loading}>
        <div className='relative w-full aspect-video rounded-xl sm:w-48'>
          <img src={video?.thumbnail} alt="" className='object-cover object-center w-full h-full rounded-xl' />
          <Text
            className='absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md'
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
            <Text as='span' className='text-xs text-[#f1f7feb5]'>
              {video?.owner.username} • {video?.views} views • {timeAgo(video?.createdAt)}
            </Text>
          </Skeleton>
        </div>
        {user?._id === playlistOwnerId && <div className='flex items-center justify-center'>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                aria-label="More options"
                className='bg-transparent hover:bg-[#ddeaf814] active:bg-[#d3edf81d] '
                color='gray'
                radius='full'
              >
                <DotsVerticalIcon width="18" height="18" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant='soft'>
              <DropdownMenu.Item onClick={(e) => handleRemoveVideo(e)}><TrashIcon />{removeContent}</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>}
      </div>
    </Link>
  )
}

export default VideoCard2
