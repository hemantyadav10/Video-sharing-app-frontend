import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { timeAgo } from '../utils/formatTimeAgo'
import { useToggleVideoLike } from '../lib/queries/likeQueries'
import { queryClient } from '../main'
import { useAuth } from '../context/authContext'
import { useRemoveVideoFromPlaylist } from '../lib/queries/playlistQueries'
import toast from 'react-hot-toast'

function VideoCard2({
  videoNumber = 0,
  video,
  playlistOwnerId,
  removeType,
  removeContent = 'Remove from playlist',
  playlistId
}) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutate: unlikeVideo } = useToggleVideoLike(video?._id)
  const { mutate: removeVideoFromPlaylist } = useRemoveVideoFromPlaylist(video, user?._id)
  const { _id: videoId } = video


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
      console.log(playlistId, videoId)
      removeVideoFromPlaylist({ playlistId, videoId }, {
        onSuccess: () => {
          toast(`Removed from ${playlistName}`)
          console.log(`Removed from ${playlistName}`)
        }
      })
    }

  }

  return (
    <Link
      to={`/watch/${video?._id}`}
      className='flex flex-col w-full gap-2 p-4 hover:bg-[#ddeaf814] rounded-2xl sm:flex-row sm:py-2   active:bg-[#ddeaf81a]'
    >
      <div className='items-center justify-center hidden text-sm transition-all sm:flex'>
        {videoNumber}
      </div>
      <div className='w-full aspect-video rounded-xl sm:w-48'>
        <img src={video?.thumbnail} alt="" className='object-cover object-center w-full rounded-xl' />
      </div>
      <div className='flex flex-1 gap-1'>
        <div className='flex-1 '>
          <p title={video?.title}
            className='mb-2 text-base font-medium line-clamp-2 lg:text-sm xl:text-base'>
            {video?.title}
          </p>
          <p className='text-xs text-[#f1f7feb5]'>
            {video?.owner.username} • {video?.views} views • {timeAgo(video?.createdAt)}
          </p>
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
