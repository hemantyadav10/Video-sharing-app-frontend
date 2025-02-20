import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { AspectRatio, DropdownMenu, IconButton, Skeleton, Spinner, Text } from '@radix-ui/themes'
import { ListVideo } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import noThumbnail from '../assets/noThumbnail.webp'
import { useAuth } from '../context/authContext'
import { useDeletePlaylist } from '../lib/queries/playlistQueries'
import { timeAgo } from '../utils/formatTimeAgo'

function PlaylistCard({
  playlistData,
  loading
}) {
  const { isAuthenticated, user } = useAuth()
  const { mutate: deletePlaylist, isPending, } = useDeletePlaylist(playlistData?._id, user?._id)

  const handleDeletePlaylist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending) return;
    deletePlaylist(playlistData?._id, {
      onSuccess: () => {
        toast.success('Playlist deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }


  return (
    <Skeleton loading={loading} className=' rounded-xl'>
      <Link to={`/playlist/${playlistData?._id}`} className='space-y-2 group'>
        <div className='relative aspect-video' title={playlistData?.name || ''}>
          <AspectRatio
            ratio={16 / 9}
            className='z-[3] relative '
          >
            <img
              src={playlistData?.thumbnail || noThumbnail}
              alt="A house in a forest"
              className='object-cover object-center w-full h-full border-t border-[var(--color-background)] rounded-xl'
            />
            {/* Background overlay with opacity transition */}
            <div className="absolute inset-0 transition-opacity opacity-0 bg-black/70 rounded-xl group-hover:opacity-100"></div>

            {/* Text overlay without opacity change */}
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white transition-opacity opacity-0 group-hover:opacity-100">
              View full playlist
            </div>

          </ AspectRatio>
          <div className='absolute bottom-0 z-[2] left-2 right-2 h-[calc(100%+4px)] bg-gray-400 border rounded-xl border-[var(--color-background)]'></div>
          <div className='absolute bottom-0 z-[1] left-4 right-4 bg-gray-600 h-[calc(100%+8px)] rounded-xl border border-[var(--color-background)]'></div>
          <span className='absolute bottom-2 text-xs font-medium bg-black/70 z-[4] right-2 px-1 py-[2px] rounded-sm flex gap-[2px] items-center text-white'> <ListVideo strokeWidth={1.5} size={16} /> {playlistData?.totalVideos} videos</span>
        </div>
        <div className='flex'>
          <div className='flex-1'>
            <p className='text-sm font-medium line-clamp-2'>
              {playlistData?.name}
            </p>
            <Text size={'1'} color='gray'>
              {`Updated ${timeAgo(playlistData?.updatedAt)}`}
            </Text>
          </div>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger hidden={!isAuthenticated}>
                <IconButton
                  variant='ghost'
                  mx={1}
                  aria-label="More options"
                  color='gray'
                  radius='full'
                  highContrast
                  title='More options'
                >
                  <DotsVerticalIcon width="18" height="18" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant='soft' color='red' >
                <DropdownMenu.Item
                  onClick={(e) => handleDeletePlaylist(e)}
                  disabled={isPending}
                  color='red'
                >
                  <Spinner loading={isPending}>
                    <TrashIcon />
                  </Spinner>
                  Delete playlist
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </Link>
    </Skeleton>
  )
}

export default PlaylistCard
